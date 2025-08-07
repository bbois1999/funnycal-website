import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function sanitize(s: string) {
  return (s || '')
    .replace(/[^a-zA-Z0-9_\-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64)
}

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
    const orderJsonPath = path.join(process.cwd(), 'data', 'orders', `${orderId}.json`)

    // Load order to know items and per-item subfolders
    let order: any = null
    try {
      const txt = await fsp.readFile(orderJsonPath, 'utf8')
      order = JSON.parse(txt)
    } catch {
      // proceed best-effort even if order JSON missing
    }

    // Build zip
    const archive = archiver('zip', { zlib: { level: 9 } })
    const chunks: Buffer[] = []
    archive.on('data', (chunk) => chunks.push(chunk as Buffer))

    if (order && Array.isArray(order.items) && fs.existsSync(baseDir)) {
      // Add each item as a separate top-level folder in the zip
      for (let idx = 0; idx < order.items.length; idx += 1) {
        const item = order.items[idx]
        const folderId: string | undefined = item?.outputFolderId
        if (!folderId) continue
        const src = path.join(baseDir, folderId)
        if (!fs.existsSync(src)) continue
        const label = `${String(idx + 1).padStart(2, '0')}_${sanitize(item.templateName || 'item')}_${sanitize(folderId)}`
        archive.directory(src, label)
      }
    } else if (fs.existsSync(baseDir)) {
      // Fallback: zip the entire base directory
      archive.directory(baseDir, false)
    } else {
      return new NextResponse('No files for this order', { status: 404 })
    }

    await archive.finalize()
    const zipBuffer = Buffer.concat(chunks)

    // Auto-move status to processing on first download
    try {
      const txt = await fsp.readFile(orderJsonPath, 'utf8')
      const obj = JSON.parse(txt)
      if (obj && (obj.status === 'new' || obj.status === 'placed')) {
        obj.status = 'processing'
        obj.updatedAt = new Date().toISOString()
        await fsp.writeFile(orderJsonPath, JSON.stringify(obj, null, 2), 'utf8')
      }
    } catch {
      // ignore
    }

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
