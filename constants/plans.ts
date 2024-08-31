import { ReactNode } from "react";

export interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  unavailable: string[];
  buttonLabel: string;
  stripePriceId: string | { monthly: string; yearly: string };
  description?: ReactNode; // Optional properties
  details?: ReactNode; // Optional properties
}

export const plans: Plan[] = [
  {
    name: 'Basic',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to forums - Available',
      'Basic support - Available',
      'Free Plan - Available'
    ],
    unavailable: [
      'Premium content - Not Available',
      'Priority support - Not Available',
      'Dedicated account manager - Not Available'
    ],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    description: 'The Basic plan provides essential access to community forums, basic support, and is completely free of charge. It is suitable for users who need minimal features and support.',
    details: 'This plan includes access to community forums and basic support. It does not include advanced features like premium content, priority support, or a dedicated account manager.'
  },
  {
    name: 'Pro',
    monthlyPrice: 450,
    yearlyPrice: 4500,
    features: [
      'Access to forums - Available',
      'Premium content - Available',
      'Priority support - Available'
    ],
    unavailable: [
      'Dedicated account manager - Not Available'
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
    description: 'The Pro plan includes premium content and priority support along with all benefits of the Basic plan. It is designed for users who need additional resources and enhanced support.',
    details: 'This plan provides access to premium content and priority support, but does not include a dedicated account manager. It is ideal for users seeking more advanced features and support compared to the Basic plan.'
  },
  {
    name: 'Premium',
    monthlyPrice: 800,
    yearlyPrice: 8000,
    features: [
      'Access to forums - Available',
      'Premium content - Available',
      'Priority support - Available',
      'Dedicated account manager - Available'
    ],
    unavailable: [
      'Advanced analytics - Not Available',
      'Custom integrations - Not Available'
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    description: 'The Premium plan provides all features of the Pro plan plus a dedicated account manager. It offers the highest level of support and exclusive benefits, making it perfect for users who require the utmost support and personalization.',
    details: 'This plan includes all features of the Pro plan and adds a dedicated account manager. It is designed for users needing the highest level of support and personalized assistance. Advanced analytics and custom integrations are not included in this plan.'
  },
];
