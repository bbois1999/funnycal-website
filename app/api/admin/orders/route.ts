import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    try {
      await fs.mkdir(ordersDir, { recursive: true })
    } catch {}

    const files = await fs.readdir(ordersDir)
    const orders = [] as any[]
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const text = await fs.readFile(path.join(ordersDir, file), 'utf8')
      try {
        orders.push(JSON.parse(text))
      } catch {}
    }

    // sort newest first
    orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

    return NextResponse.json({ orders })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ orders: [] })
  }
}
