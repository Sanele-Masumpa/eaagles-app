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
    unavailable: [],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    description: undefined,
    details: undefined
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
    description: undefined,
    details: undefined
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
    unavailable: [],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    description: undefined,
    details: undefined
  },
];

