import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const prisma = new PrismaClient();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature']!;
  const body = req.body;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Safely access session metadata
    const planType = session.metadata?.planType ?? 'unknown';
    const clientReferenceId = session.client_reference_id ?? '0';
    const stripeSubscriptionId = session.subscription as string; // Ensure it's a string

    // Calculate end date based on subscription period
    let endDate: Date;
    if (planType === 'monthly') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === 'yearly') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate = new Date(); // Default to current date if planType is unknown
    }

    try {
      // Ensure stripeSubscriptionId is a string
      if (typeof stripeSubscriptionId === 'string') {
        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        // Ensure that subscription details are available
        const planName = subscription.items.data[0]?.price?.nickname ?? 'Unknown Plan';

        // Create or update the subscription record
        await prisma.subscription.create({
          data: {
            userId: parseInt(clientReferenceId), // Convert to number, default to 0 if null
            planName,
            planType,
            stripeSubscriptionId,
            endDate,
          },
        });
      } else {
        throw new Error('Invalid subscription ID');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).send('Error creating subscription record');
    }
  }

  res.json({ received: true });
}
