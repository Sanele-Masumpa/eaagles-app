import { clerkClient } from "@clerk/nextjs/server";
import { stripeApiClient } from "use-stripe-subscription";

export const findOrCreateCustomerId = async ({
  clerkUserId,
}: {
  clerkUserId: string;
}): Promise<string> => {
  try {
    // Retrieve user from Clerk
    let user = await clerkClient.users.getUser(clerkUserId);
    
    // Check if Stripe customer ID already exists
    if (user.publicMetadata.stripeCustomerId) {
      return user.publicMetadata.stripeCustomerId as string;
    }
    
    // Create a new Stripe customer
    const customerCreate = await stripeApiClient.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses.find(
        (x) => x.id === user.primaryEmailAddressId
      )?.emailAddress ?? '', // Handle case where email might be undefined
      metadata: {
        clerkUserId: user.id,
      },
    }, {
      idempotencyKey: user.id,
    });
    
    // Update Clerk user with new Stripe customer ID
    user = await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        stripeCustomerId: customerCreate.id,
      },
    });
    
    return user.publicMetadata.stripeCustomerId as string;
  } catch (error) {
    console.error("Error finding or creating Stripe customer ID:", error);
    throw new Error("Failed to find or create Stripe customer ID");
  }
};
