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
      { feature: 'Access to forums', available: true },
      { feature: 'Basic support', available: true },
      { feature: 'Free Plan', available: true },
      { feature: 'Premium content', available: false },
      { feature: 'Priority support', available: false },
      { feature: 'Dedicated account manager', available: false },
    ],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    description: 'Perfect for getting started with the basics.',
    details: 'The Basic plan offers fundamental features at no cost.'
  },
  {
    name: 'Pro',
    monthlyPrice: 450,
    yearlyPrice: 4500,
    features: [
      { feature: 'Access to forums', available: true },
      { feature: 'Premium content', available: true },
      { feature: 'Priority support', available: true },
      { feature: 'Dedicated account manager', available: false },
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
    description: 'Ideal for professionals who need more features and support.',
    details: 'The Pro plan provides access to premium content and priority support.'
  },
  {
    name: 'Premium',
    monthlyPrice: 800,
    yearlyPrice: 8000,
    features: [
      { feature: 'Access to forums', available: true },
      { feature: 'Premium content', available: true },
      { feature: 'Priority support', available: true },
      { feature: 'Dedicated account manager', available: true },
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    description: 'Best for businesses or individuals needing full access and support.',
    details: 'The Premium plan includes all features, including a dedicated account manager.'
  },
];
