import { NextRequest, NextResponse } from 'next/server';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') as string;
  const buf = await buffer(request);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook error:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    } else {
      console.error('Webhook error:', err);
      return NextResponse.json({ error: 'Webhook Error: An unknown error occurred.' }, { status: 400 });
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event);
      break;
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event);
      break;
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Handle checkout session completed
const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const subscriptionId = session.subscription as string;

  // Retrieve the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Find the user by their Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    console.error('User not found for subscription:', subscriptionId);
    return;
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      planName: subscription.items.data[0].plan.id,
      planType: subscription.items.data[0].plan.interval,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
    },
    create: {
      userId: user.id,
      planName: subscription.items.data[0].plan.id,
      planType: subscription.items.data[0].plan.interval,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
      stripeSubscriptionId: subscription.id,
    },
  });
};

// Handle invoice payment succeeded
const handleInvoicePaymentSucceeded = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'active' },
  });
};

// Handle subscription updated
const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      planName: subscription.items.data[0].plan.id,
      planType: subscription.items.data[0].plan.interval,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      status: subscription.status,
    },
  });
};

// Handle subscription deleted
const handleSubscriptionDeleted = async (event: Stripe.Event) => {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'canceled' },
  });
};
