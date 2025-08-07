import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function readOrder(orderId: string) {
  const fs = await import('fs/promises')
  const path = await import('path')
  const base = path.join(process.cwd(), 'data', 'orders')
  const live = path.join(base, `${orderId}.json`)
  try {
    const json = await fs.readFile(live, 'utf8')
    return JSON.parse(json)
  } catch {}
  const archived = path.join(base, 'archive', `${orderId}.json`)
  try {
    const json = await fs.readFile(archived, 'utf8')
    return JSON.parse(json)
  } catch {}
  return null
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const order = await readOrder(id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ order })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
