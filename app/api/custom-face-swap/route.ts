import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

interface FaceSwapResult {
  success: boolean;
  error?: string;
  output_files?: string[];
  watermarked_files?: string[];
  total_processed?: number;
  template_folder?: string;
  failures?: Array<{ file: string; reason: string; message: string }>;
}

type MonthInput = {
  path?: string; // public path like /template-images/superhero/1superman.png
  dataUrl?: string; // data URL for uploaded custom scene
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const faceFile = formData.get('photo') as File | null;
    const monthsJson = formData.get('months') as string | null;

    if (!faceFile) {
      return NextResponse.json({ error: 'No face photo uploaded' }, { status: 400 });
    }
    if (!monthsJson) {
      return NextResponse.json({ error: 'Missing months selection' }, { status: 400 });
    }

    const months: MonthInput[] = JSON.parse(monthsJson);
    if (!Array.isArray(months) || months.length !== 12) {
      return NextResponse.json({ error: 'Months payload must be an array of 12 items' }, { status: 400 });
    }

    // Directories
    const faceswapRoot = path.join(process.cwd(), 'faceswap');
    const uploadsDir = path.join(faceswapRoot, 'uploads');
    const templateImagesRoot = path.join(faceswapRoot, 'template-images');
    const customRoot = path.join(templateImagesRoot, 'custom');

    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });
    if (!existsSync(customRoot)) await mkdir(customRoot, { recursive: true });

    // Save face photo
    const faceBytes = await faceFile.arrayBuffer();
    const faceBuffer = Buffer.from(faceBytes);
    const faceExt = faceFile.name.split('.').pop() || 'jpg';
    const faceFilename = `user_photo_${Date.now()}.${faceExt}`;
    const faceFilepath = path.join(uploadsDir, faceFilename);
    await writeFile(faceFilepath, faceBuffer);

    // Create a custom session folder under template-images
    const sessionId = `custom_${Date.now()}`;
    const sessionTemplateFolder = path.join(customRoot, sessionId);
    await mkdir(sessionTemplateFolder, { recursive: true });

    // Materialize 12 target images into the session folder
    for (let i = 0; i < 12; i++) {
      const item = months[i];
      const targetName = `${i + 1}.png`;
      const targetPath = path.join(sessionTemplateFolder, targetName);

      if (item.dataUrl) {
        // Decode data URL
        const match = item.dataUrl.match(/^data:(.+);base64,(.*)$/);
        if (!match) {
          return NextResponse.json({ error: `Invalid data URL for month ${i + 1}` }, { status: 400 });
        }
        const base64 = match[2];
        const buffer = Buffer.from(base64, 'base64');
        await writeFile(targetPath, buffer);
      } else if (item.path && item.path.startsWith('/template-images/')) {
        // Map public path to faceswap/template-images
        const rel = item.path.replace(/^\/+template-images\//, '');
        const sourcePath = path.join(templateImagesRoot, rel);
        await copyFile(sourcePath, targetPath);
      } else {
        return NextResponse.json({ error: `Missing image for month ${i + 1}` }, { status: 400 });
      }
    }

    // Setup output directory
    const outputDir = path.join(faceswapRoot, 'output', `${sessionId}_${Date.now()}`);
    await mkdir(outputDir, { recursive: true });

    // Run face swap using the custom session folder
    const templateFolderArg = path.join('custom', sessionId); // relative from template-images
    const result = await runFaceSwap(faceFilepath, templateFolderArg, outputDir);

    if (!result.success) {
      return NextResponse.json({ error: result.error, failures: result.failures || [] }, { status: 200 });
    }

    // Build API-serving paths for watermarked images
    const apiPaths = (result.watermarked_files || []).map((filePath) => {
      const fileName = path.basename(filePath);
      const folderName = path.basename(path.dirname(path.dirname(filePath))); // output/<folder>/watermarked/<file>
      return `/api/serve-image?folder=${folderName}/watermarked&file=${fileName}`;
    });

    return NextResponse.json({
      success: true,
      output_files: apiPaths,
      total_processed: result.total_processed,
      template_folder: templateFolderArg,
      output_folder_id: path.basename(outputDir),
      failures: result.failures || [],
    });
  } catch (error) {
    console.error('Custom face swap API error:', error);
    return NextResponse.json({ error: 'Custom face swap processing failed' }, { status: 500 });
  }
}

function runFaceSwap(sourcePath: string, templateFolder: string, outputDir: string): Promise<FaceSwapResult> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'faceswap', 'batch_face_swap.py');
    const venvPath = path.join(process.cwd(), 'faceswap', '.venv');
    const pythonPath = path.join(venvPath, 'Scripts', 'python.exe');

    const childProcess = spawn(pythonPath, [
      scriptPath,
      '--source', sourcePath,
      '--template', templateFolder,
      '--output', outputDir,
    ], { cwd: path.join(process.cwd(), 'faceswap') });

    let output = '';
    let errorOutput = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    childProcess.on('close', (code) => {
      try {
        const fs = require('fs');
        const watermarkedDir = path.join(outputDir, 'watermarked');
        const outputFiles = fs.existsSync(outputDir)
          ? fs.readdirSync(outputDir).filter((f: string) => f.startsWith('swapped_')).map((f: string) => path.join(outputDir, f))
          : [];
        const watermarkedFiles = fs.existsSync(watermarkedDir)
          ? fs.readdirSync(watermarkedDir).filter((f: string) => f.startsWith('swapped_')).map((f: string) => path.join(watermarkedDir, f))
          : [];

        // Attempt to read detailed report
        let failures: Array<{ file: string; reason: string; message: string }> = [];
        const reportPath = path.join(outputDir, 'report.json');
        if (fs.existsSync(reportPath)) {
          try {
            const reportRaw = fs.readFileSync(reportPath, 'utf-8');
            const report = JSON.parse(reportRaw);
            if (Array.isArray(report.failures)) failures = report.failures;
          } catch {}
        }

        const success = code === 0 && outputFiles.length > 0;
        resolve({
          success,
          output_files: outputFiles,
          watermarked_files: watermarkedFiles,
          total_processed: outputFiles.length,
          template_folder: templateFolder,
          failures,
          ...(success ? {} : { error: errorOutput || 'Some scenes could not be processed' })
        });
      } catch (e) {
        resolve({ success: false, error: 'Face swap completed but could not read output files' });
      }
    });
    childProcess.on('error', (err) => {
      resolve({ success: false, error: `Failed to start face swap process: ${err.message}` });
    });
  });
}


