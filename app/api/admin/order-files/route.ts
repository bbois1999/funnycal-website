import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('order')
    if (!orderId) return new NextResponse('Missing order', { status: 400 })

    const path = await import('path')
    const fs = await import('fs')
    const fsp = await import('fs/promises')
    const archiver = (await import('archiver')).default

    const baseDir = path.join(process.cwd(), 'faceswap', 'orders', orderId)
    try {
      await fsp.access(baseDir)
    } catch {
      return new NextResponse('No files for this order', { status: 404 })
    }

    // Stream zip
    const archive = archiver('zip', { zlib: { level: 9 } })

    const { readable, writable } = new (await import('stream')).PassThrough() as any
    const stream = new (await import('stream')).PassThrough()

    const chunks: Buffer[] = []
    stream.on('data', (c) => chunks.push(c))

    archive.directory(baseDir, false)
    archive.finalize()

    const promise = new Promise<Buffer>((resolve, reject) => {
      archive.on('error', reject)
      archive.on('data', (chunk) => stream.write(chunk))
      archive.on('end', () => {
        stream.end()
        resolve(Buffer.concat(chunks))
      })
    })

    const zipBuffer = await promise

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${orderId}.zip"`,
      },
    })
  } catch (e) {
    console.error(e)
    return new NextResponse('Server error', { status: 500 })
  }
}
