import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// We lazy import stripe to avoid bundling issues
async function getStripe() {
  const Stripe = (await import('stripe')).default
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY missing')
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
}

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} missing`)
  return v
}

async function saveOrderFile(orderId: string, payload: any) {
  const fs = await import('fs/promises')
  const path = await import('path')
  const ordersDir = path.join(process.cwd(), 'data', 'orders')
  await fs.mkdir(ordersDir, { recursive: true })
  const orderPath = path.join(ordersDir, `${orderId}.json`)
  await fs.writeFile(orderPath, JSON.stringify(payload, null, 2), 'utf8')
}

async function copyOutputFoldersToOrders(orderId: string, folderIds: string[]) {
  const fs = await import('fs/promises')
  const fssync = await import('fs')
  const path = await import('path')

  const srcRoot = path.join(process.cwd(), 'faceswap', 'output')
  const dstRoot = path.join(process.cwd(), 'faceswap', 'orders', orderId)
  await fs.mkdir(dstRoot, { recursive: true })

  async function copyDir(src: string, dest: string) {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath)
      } else if (entry.isFile()) {
        await fs.copyFile(srcPath, destPath)
      }
    }
  }

  for (const folder of folderIds) {
    const safe = folder.replace(/[^a-zA-Z0-9_\-]/g, '')
    const src = path.join(srcRoot, safe)
    if (fssync.existsSync(src)) {
      const dest = path.join(dstRoot, safe)
      await copyDir(src, dest)
    }
  }
}

async function maybeSendEmail(order: any) {
  try {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.NOTIFY_EMAIL_TO
    const from = process.env.NOTIFY_EMAIL_FROM || (user ? user : undefined)

    if (!host || !port || !user || !pass || !to || !from) {
      return // email not configured
    }

    const nodemailer = (await import('nodemailer')).default
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others
      auth: { user, pass },
    })

    const subject = `New FunnyCal Order: ${order.orderId}`
    const text = [
      `Order ID: ${order.orderId}`,
      `Placed: ${order.createdAt}`,
      `Customer: ${order.customer?.name || 'N/A'} <${order.customer?.email || 'N/A'}>`,
      order.customer?.address ?
        `Address: ${order.customer.address.line1 || ''} ${order.customer.address.line2 || ''}, ${order.customer.address.city || ''}, ${order.customer.address.state || ''} ${order.customer.address.postal_code || ''}` :
        'Address: N/A',
      `Items:`,
      ...(order.items || []).map((it: any) => ` - ${it.templateName} [${it.outputFolderId}]`),
    ].join('\n')

    await transporter.sendMail({ from, to, subject, text })
  } catch (e) {
    console.error('Email notification failed:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const stripe = await getStripe()
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET')
    const raw = await req.text()

    let event
    try {
      event = stripe.webhooks.constructEvent(raw, sig as string, webhookSecret)
    } catch (err: any) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      // Metadata from create-session
      const folders: string[] = (session.metadata?.folders || '').split('|').filter(Boolean)
      const templates: string[] = (session.metadata?.templates || '').split('|').filter(Boolean)
      const names: string[] = (session.metadata?.names || '').split('|').filter(Boolean)

      // Customer details captured by Stripe (if enabled in session creation)
      const customer_email: string | undefined = session.customer_details?.email || session.customer_email || undefined
      const customer_name: string | undefined = session.customer_details?.name || undefined
      const address = session.customer_details?.address || session.shipping_details?.address || undefined

      const orderId = session.id
      const createdAt = new Date(session.created * 1000).toISOString()

      const items = names.map((n, idx) => ({
        templateName: n,
        template: templates[idx] || undefined,
        outputFolderId: folders[idx] || undefined,
      }))

      const orderRecord = {
        orderId,
        status: 'placed',
        createdAt,
        customer: {
          name: customer_name || null,
          email: customer_email || null,
          address: address || null,
        },
        items,
      }

      await saveOrderFile(orderId, orderRecord)

      try {
        if (folders.length > 0) {
          await copyOutputFoldersToOrders(orderId, folders)
        }
      } catch (e) {
        console.error('Copy to orders area failed:', e)
      }

      // Optional email notification
      await maybeSendEmail(orderRecord)

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('Webhook handler error:', e)
    return new NextResponse('Server error', { status: 500 })
  }
}
