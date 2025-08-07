import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function saveOrder(order: any) {
  const fs = await import('fs/promises')
  const path = await import('path')
  const base = path.join(process.cwd(), 'data', 'orders')
  await fs.mkdir(base, { recursive: true })
  await fs.writeFile(path.join(base, `${order.orderId}.json`), JSON.stringify(order, null, 2), 'utf8')
}

async function maybeEmailCustomer(order: any) {
  if (!order?.customer?.email) return

  try {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.NOTIFY_EMAIL_FROM || (user ? user : undefined)

    if (!host || !port || !user || !pass || !from) return

    const nodemailer = (await import('nodemailer')).default
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const subject = `Your FunnyCal Order ${order.orderId} - ${order.status.toUpperCase()}`
    const text = `Hello${order.customer?.name ? ' ' + order.customer.name : ''},\n\n` +
      `Your order is now marked as: ${order.status}.\n\n` +
      `We will notify you again when there are further updates.\n\n` +
      `Thanks for choosing FunnyCal!\nFunnyCal LLC\nsupport@funnycal.com\n`

    await transporter.sendMail({ from, to: order.customer.email, subject, text })
  } catch (e) {
    console.error('Customer email failed:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, status } = body as { orderId: string; status: string }
    if (!orderId || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const getRes = await fetch(`${process.env.SITE_URL || 'http://localhost:3000'}/api/admin/order/get?id=${orderId}`, { cache: 'no-store' })
    const d = await getRes.json()
    if (!getRes.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const order = d.order
    order.status = status
    order.updatedAt = new Date().toISOString()

    await saveOrder(order)
    await maybeEmailCustomer(order)

    return NextResponse.json({ ok: true, order })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
