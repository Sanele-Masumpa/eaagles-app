// app/api/webhooks/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/prisma'; // Adjust the import path based on your setup
import rawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const buf = await rawBody(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new NextResponse('Webhook Error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        return new NextResponse('User ID not found in session metadata', { status: 400 });
      }

      const displayItemPrice = session.line_items?.data[0]?.price?.id || ''; // Handle possibly undefined properties

      const subscriptionId = session.subscription;
      let subscription: Stripe.Subscription | null = null;

      // Fetch the subscription if it is a string (i.e., subscription ID)
      if (typeof subscriptionId === 'string') {
        try {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        } catch (error) {
          console.error('Error retrieving subscription:', error);
          return new NextResponse('Error retrieving subscription', { status: 400 });
        }
      } else if (subscriptionId && typeof subscriptionId === 'object') {
        // subscriptionId is already a Subscription object
        subscription = subscriptionId;
      }

      const subscriptionEndDate = subscription && 'current_period_end' in subscription
        ? new Date(subscription.current_period_end * 1000)
        : new Date(); // Default to current date if no subscription or period end date

      // Handle subscription creation in the database
      await db.subscription.upsert({
        where: { userId: parseInt(userId, 10) },
        update: {
          priceId: displayItemPrice,
          currentPeriodEnd: subscriptionEndDate,
          status: session.payment_status,
        },
        create: {
          userId: parseInt(userId, 10),
          priceId: displayItemPrice,
          currentPeriodEnd: subscriptionEndDate,
          status: session.payment_status,
        },
      });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(JSON.stringify({ received: true }));
}
