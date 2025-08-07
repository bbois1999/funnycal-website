import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function toUnix(ts: string): number {
  return Math.floor(new Date(ts).getTime() / 1000)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start') // ISO date or datetime
    const end = searchParams.get('end')

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })

    const fs = await import('fs/promises')
    const path = await import('path')

    const startUnix = start ? toUnix(start) : toUnix(new Date(Date.now() - 24 * 3600 * 1000).toISOString())
    const endUnix = end ? toUnix(end) : toUnix(new Date().toISOString())

    // Stripe: list paid Checkout Sessions in range
    const sessions: string[] = []
    let starting_after: string | undefined = undefined
    // iterate pages
    for (let i = 0; i < 20; i++) {
      const resp = await stripe.checkout.sessions.list({
        limit: 100,
        created: { gte: startUnix, lte: endUnix },
        starting_after,
      })
      for (const s of resp.data) {
        if ((s.payment_status as any) === 'paid') {
          sessions.push(s.id)
        }
      }
      if (resp.has_more) starting_after = resp.data[resp.data.length - 1]?.id
      else break
    }

    // Local orders
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    try { await fs.mkdir(ordersDir, { recursive: true }) } catch {}
    const files = await fs.readdir(ordersDir)
    const localIds: string[] = []
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      try {
        const txt = await fs.readFile(path.join(ordersDir, f), 'utf8')
        const obj = JSON.parse(txt)
        const created = obj?.createdAt ? new Date(obj.createdAt).getTime() : undefined
        if (created && created >= startUnix * 1000 && created <= endUnix * 1000) {
          localIds.push(obj.orderId)
        }
      } catch {}
    }

    const stripeNotInLocal = sessions.filter((id) => !localIds.includes(id))
    const localNotInStripe = localIds.filter((id) => !sessions.includes(id))

    return NextResponse.json({
      range: { startUnix, endUnix },
      stripePaidCount: sessions.length,
      localOrderCount: localIds.length,
      stripeNotInLocal,
      localNotInStripe,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
