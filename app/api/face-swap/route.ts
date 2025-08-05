import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Map frontend template names to folder names
const TEMPLATE_MAPPING: Record<string, string> = {
  'swimsuit': 'swimsuit',
  'superhero': 'superhero', 
  'memes': 'meme',
  'junkies': 'junkies',
  'hunk': 'firefighter',
  'holiday': 'holiday',
  'babies': 'baby'
};

interface FaceSwapResult {
  success: boolean;
  error?: string;
  output_files?: string[];
  watermarked_files?: string[];
  total_processed?: number;
  template_folder?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    const templateType = formData.get('template') as string;

    if (!file) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 });
    }

    if (!templateType || !TEMPLATE_MAPPING[templateType]) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'faceswap', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `user_photo_${Date.now()}.${file.name.split('.').pop()}`;
    const filepath = path.join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);
    console.log(`Uploaded file saved to: ${filepath}`);

    // Setup output directory
    const outputDir = path.join(process.cwd(), 'faceswap', 'output', `${templateType}_${Date.now()}`);
    await mkdir(outputDir, { recursive: true });

    // Get the template folder name
    const templateFolder = TEMPLATE_MAPPING[templateType];

    // Run face swap script
    const result = await runFaceSwap(filepath, templateFolder, outputDir);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Create API paths to serve the watermarked images for display
    const apiPaths = result.watermarked_files?.map(filePath => {
      const fileName = path.basename(filePath);
      const folderName = path.basename(path.dirname(path.dirname(filePath))); // Go up two levels from watermarked subfolder
      return `/api/serve-image?folder=${folderName}/watermarked&file=${fileName}`;
    }) || [];

    return NextResponse.json({
      success: true,
      output_files: apiPaths,
      total_processed: result.total_processed,
      template_folder: result.template_folder
    });

  } catch (error) {
    console.error('Face swap API error:', error);
    return NextResponse.json(
      { error: 'Face swap processing failed' }, 
      { status: 500 }
    );
  }
}

function runFaceSwap(sourcePath: string, templateFolder: string, outputDir: string): Promise<FaceSwapResult> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'faceswap', 'batch_face_swap.py');
    const venvPath = path.join(process.cwd(), 'faceswap', '.venv');
    const pythonPath = path.join(venvPath, 'Scripts', 'python.exe'); // Windows path

    console.log(`Running face swap with python: ${pythonPath}`);
    console.log(`Script: ${scriptPath}`);
    console.log(`Source: ${sourcePath}`);
    console.log(`Template: ${templateFolder}`);
    console.log(`Output: ${outputDir}`);

    const childProcess = spawn(pythonPath, [
      scriptPath,
      '--source', sourcePath,
      '--template', templateFolder,
      '--output', outputDir
    ], {
      cwd: path.join(process.cwd(), 'faceswap')
    });

    let output = '';
    let errorOutput = '';

    childProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('Python stdout:', text);
    });

    childProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error('Python stderr:', text);
    });

    childProcess.on('close', (code) => {
      console.log(`Face swap process exited with code: ${code}`);
      
      if (code === 0) {
        // Try to parse success information from output
        try {
          // Look for output files in both output directory and watermarked subdirectory
          const fs = require('fs');
          const outputFiles = fs.readdirSync(outputDir)
            .filter((file: string) => file.startsWith('swapped_'))
            .map((file: string) => path.join(outputDir, file));

          const watermarkedDir = path.join(outputDir, 'watermarked');
          let watermarkedFiles: string[] = [];
          if (fs.existsSync(watermarkedDir)) {
            watermarkedFiles = fs.readdirSync(watermarkedDir)
              .filter((file: string) => file.startsWith('swapped_'))
              .map((file: string) => path.join(watermarkedDir, file));
          }

          resolve({
            success: true,
            output_files: outputFiles,
            watermarked_files: watermarkedFiles,
            total_processed: outputFiles.length,
            template_folder: templateFolder
          });
        } catch (e) {
          resolve({
            success: false,
            error: 'Face swap completed but could not read output files'
          });
        }
      } else {
        resolve({
          success: false,
          error: errorOutput || 'Face swap process failed'
        });
      }
    });

    childProcess.on('error', (error) => {
      console.error('Failed to start face swap process:', error);
      resolve({
        success: false,
        error: `Failed to start face swap process: ${error.message}`
      });
    });
  });
}