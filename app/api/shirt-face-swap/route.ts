import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { spawn } from 'child_process'

interface FaceSwapResult {
  success: boolean
  error?: string
  output_file?: string
  watermarked_file?: string
  failures?: Array<{ file: string; reason: string; message: string }>
}

async function runFaceSwap(
  userImagePath: string,
  templatePath: string,
  outputDir: string,
  productType: string
): Promise<FaceSwapResult> {
  return new Promise((resolve) => {
    const pythonScript = path.join(process.cwd(), 'faceswap', 'single_face_swap.py')
    
    const childProcess = spawn('python', [
      pythonScript,
      userImagePath,
      templatePath,
      outputDir,
      productType
    ])

    let output = ''
    let error = ''

    childProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    childProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`)
      
      if (code !== 0) {
        console.error('Python script error:', error)
        resolve({
          success: false,
          error: `Face swap failed: ${error || 'Unknown error'}`
        })
        return
      }

      try {
        // Try to read the report file
        const reportPath = path.join(outputDir, 'report.json')
        if (require('fs').existsSync(reportPath)) {
          const reportData = require('fs').readFileSync(reportPath, 'utf8')
          const result = JSON.parse(reportData)
          resolve(result)
        } else {
          // Fallback to parsing output
          const lines = output.trim().split('\n')
          const lastLine = lines[lines.length - 1]
          
          try {
            const result = JSON.parse(lastLine)
            resolve(result)
          } catch {
            resolve({
              success: false,
              error: 'Failed to parse face swap result'
            })
          }
        }
      } catch (parseError) {
        console.error('Error parsing result:', parseError)
        resolve({
          success: false,
          error: 'Failed to process face swap result'
        })
      }
    })
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const template = formData.get('template') as string

    if (!file || !template) {
      return NextResponse.json({ error: 'Missing file or template' }, { status: 400 })
    }

    // Create unique folder ID for this face swap
    const folderId = `shirt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const uploadsDir = path.join(process.cwd(), 'faceswap', 'uploads')
    const outputDir = path.join(process.cwd(), 'faceswap', 'output', folderId)

    // Ensure directories exist
    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.mkdir(outputDir, { recursive: true })

    // Save uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const userImagePath = path.join(uploadsDir, `${folderId}_user.jpg`)
    await fs.writeFile(userImagePath, buffer)

    // Get template path
    const templatePath = path.join(process.cwd(), 'faceswap', 'template-images', template)

    // Run face swap
    const result = await runFaceSwap(userImagePath, templatePath, outputDir, 'shirt')

    if (result.success && result.output_file && result.watermarked_file) {
      return NextResponse.json({
        success: true,
        output_file: `/api/serve-image?path=${encodeURIComponent(result.output_file)}`,
        watermarked_file: `/api/serve-image?path=${encodeURIComponent(result.watermarked_file)}`,
        output_folder_id: folderId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Face swap failed',
        failures: result.failures || []
      })
    }
  } catch (error) {
    console.error('Shirt face swap error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
