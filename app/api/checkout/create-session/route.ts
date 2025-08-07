import { NextRequest, NextResponse } from 'next/server';

// Lazy import to avoid bundling issues in edge runtimes
// This route should run in the node runtime
export const runtime = 'nodejs';

function getOrigin(req: NextRequest): string {
  const headerOrigin = req.headers.get('origin');
  if (headerOrigin) return headerOrigin;
  // Fallback to SITE_URL if provided
  if (process.env.SITE_URL) return process.env.SITE_URL;
  return 'http://localhost:3000';
}

interface CartItem {
  id: string;
  type: string;
  template: string;
  templateName: string;
  price: string; // like "$24.99"
  outputFolderId: string;
  imageCount: number;
  swapImages?: string[];
  templateImage?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = (await req.json()) as {
      items: CartItem[];
      customer?: { email?: string; name?: string };
    };

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Dynamically import stripe sdk
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const origin = getOrigin(req);

    // Build line items
    const line_items = items.map((item) => {
      const unitAmount = Math.round(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 100);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.templateName,
            // Optionally include an image if absolute URL is available
            // images: item.swapImages && item.swapImages.length > 0 ? [new URL(item.swapImages[0], origin).toString()] : undefined,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      } as const;
    });

    // Compact metadata (Stripe limits apply)
    const metadata: Record<string, string> = {
      // Join folder IDs (one per cart item) using a pipe
      folders: items.map((i) => i.outputFolderId).join('|'),
      templates: items.map((i) => i.template).join('|'),
      names: items.map((i) => i.templateName).join('|'),
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: customer?.email,
      metadata,
      // Let Stripe collect shipping address if you want later:
      // shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
