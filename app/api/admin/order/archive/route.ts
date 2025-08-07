import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { orderId, deleteFiles } = await req.json() as { orderId: string; deleteFiles?: boolean }
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

    const fs = await import('fs/promises')
    const fssync = await import('fs')
    const path = await import('path')

    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    const src = path.join(ordersDir, `${orderId}.json`)
    const archiveDir = path.join(ordersDir, 'archive')
    const dest = path.join(archiveDir, `${orderId}.json`)
    await fs.mkdir(archiveDir, { recursive: true })

    try {
      await fs.rename(src, dest)
    } catch (e) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (deleteFiles) {
      const filesDir = path.join(process.cwd(), 'faceswap', 'orders', orderId)
      async function rmrf(p: string) {
        try {
          const entries = await fs.readdir(p, { withFileTypes: true })
          for (const e of entries) {
            const fp = path.join(p, e.name)
            if (e.isDirectory()) await rmrf(fp)
            else await fs.unlink(fp)
          }
          await fs.rmdir(p)
        } catch {}
      }
      if (fssync.existsSync(filesDir)) {
        await rmrf(filesDir)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
