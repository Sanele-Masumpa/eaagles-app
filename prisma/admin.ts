import { PrismaClient } from '@prisma/client';
import { stripe } from '@/utils/stripe/config';
import Stripe from 'stripe';
import { toDateTime } from '@/utils/helpers';

// Initialize Prisma Client
const prisma = new PrismaClient();zz

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  try {
    await prisma.product.upsert({
      where: { id: product.id },
      update: productData,
      create: productData
    });
    console.log(`Product inserted/updated: ${product.id}`);
  } catch (error) {
    console.error(`Product insert/update failed: ${error}`);
    throw error;
  }
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
  };

  try {
    await prisma.price.upsert({
      where: { id: price.id },
      update: priceData,
      create: priceData
    });
    console.log(`Price inserted/updated: ${price.id}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      if (retryCount < maxRetries) {
        console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await upsertPriceRecord(price, retryCount + 1, maxRetries);
      } else {
        console.error(`Price insert/update failed after ${maxRetries} retries: ${error.message}`);
        throw error;
      }
    } else {
      console.error(`Price insert/update failed: ${error}`);
      throw error;
    }
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  try {
    await prisma.product.delete({
      where: { id: product.id }
    });
    console.log(`Product deleted: ${product.id}`);
  } catch (error) {
    console.error(`Product deletion failed: ${error}`);
    throw error;
  }
};

const deletePriceRecord = async (price: Stripe.Price) => {
  try {
    await prisma.price.delete({
      where: { id: price.id }
    });
    console.log(`Price deleted: ${price.id}`);
  } catch (error) {
    console.error(`Price deletion failed: ${error}`);
    throw error;
  }
};

const upsertCustomerToPrisma = async (uuid: string, customerId: string) => {
  try {
    await prisma.customer.upsert({
      where: { id: uuid },
      update: { stripe_customer_id: customerId },
      create: { id: uuid, stripe_customer_id: customerId }
    });
    return customerId;
  } catch (error) {
    console.error(`Prisma customer record creation failed: ${error}`);
    throw error;
  }
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  try {
    const newCustomer = await stripe.customers.create(customerData);
    return newCustomer.id;
  } catch (error) {
    console.error('Stripe customer creation failed:', error);
    throw error;
  }
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  try {
    const existingPrismaCustomer = await prisma.customer.findUnique({
      where: { id: uuid }
    });

    let stripeCustomerId: string | undefined;
    if (existingPrismaCustomer?.stripe_customer_id) {
      const existingStripeCustomer = await stripe.customers.retrieve(
        existingPrismaCustomer.stripe_customer_id
      );
      stripeCustomerId = existingStripeCustomer.id;
    } else {
      const stripeCustomers = await stripe.customers.list({ email: email });
      stripeCustomerId =
        stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
    }

    const stripeIdToInsert = stripeCustomerId
      ? stripeCustomerId
      : await createCustomerInStripe(uuid, email);
    if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

    if (existingPrismaCustomer && stripeCustomerId) {
      if (existingPrismaCustomer.stripe_customer_id !== stripeCustomerId) {
        await prisma.customer.update({
          where: { id: uuid },
          data: { stripe_customer_id: stripeCustomerId }
        });
        console.warn(`Prisma customer record mismatched Stripe ID. Prisma record updated.`);
      }
      return stripeCustomerId;
    } else {
      const upsertedStripeCustomer = await upsertCustomerToPrisma(uuid, stripeIdToInsert);
      if (!upsertedStripeCustomer) throw new Error('Prisma customer record creation failed.');
      return upsertedStripeCustomer;
    }
  } catch (error) {
    console.error(`Customer creation or retrieval failed: ${error}`);
    throw error;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;

  try {
    await stripe.customers.update(customer, {
      name,
      phone,
      address: {
        city: address.city ?? undefined,
        country: address.country ?? undefined,
        line1: address.line1 ?? undefined,
        line2: address.line2 ?? undefined,
        postal_code: address.postal_code ?? undefined,
        state: address.state ?? undefined
      }
    });

    await prisma.user.update({
      where: { id: uuid },
      data: {
        billing_address: {
          city: address.city ?? undefined,
          country: address.country ?? undefined,
          line1: address.line1 ?? undefined,
          line2: address.line2 ?? undefined,
          postal_code: address.postal_code ?? undefined,
          state: address.state ?? undefined
        },
        payment_methods: { [payment_method.type]: payment_method[payment_method.type] }
      }
    });
  } catch (error) {
    console.error(`Customer update failed: ${error}`);
    throw error;
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  try {
    const customerData = await prisma.customer.findUnique({
      where: { stripe_customer_id: customerId }
    });

    if (!customerData) {
      throw new Error('Customer not found in Prisma.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method']
    });

    const subscriptionData = {
      id: subscription.id,
      user_id: customerData.id,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.quantity ?? 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null
    };

    await prisma.subscription.upsert({
      where: { id: subscription.id },
      update: subscriptionData,
      create: subscriptionData
    });

    console.log(`Inserted/updated subscription [${subscription.id}] for user [${customerData.id}]`);

    if (createAction && subscription.default_payment_method) {
      await copyBillingDetailsToCustomer(customerData.id, subscription.default_payment_method);
    }
  } catch (error) {
    console.error(`Subscription status change failed: ${error}`);
    throw error;
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};
