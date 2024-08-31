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
      'Basic support - Available',
      'Community events - Available',
      'Newsletters - Available',
      'Early access to updates - Not Available',
      'Exclusive content - Not Available'
    ],
    unavailable: [
      'Premium content - Not Available',
      'Additional storage - Not Available'
    ],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    description: 'The Basic plan provides essential access to community forums, basic support, and is completely free of charge. It includes community events and newsletters but does not offer advanced features or exclusive content.',
    details: 'This plan includes access to community forums, basic support, and free access. It does not include advanced features like premium content, priority support, or dedicated account management.'
  },
  {
    name: 'Pro',
    monthlyPrice: 450,
    yearlyPrice: 4500,
    features: [
      'Dedicated account manager - Available',
      'Advanced analytics - Available',
      'Custom integrations - Available',
      'Early access to updates - Not Available'
    ],
    unavailable: [
      'Exclusive content - Not Available',
      'Additional storage - Not Available',
      'One-on-one training - Not Available'
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
    description: 'The Pro plan includes premium content, priority support, and a dedicated account manager, along with additional features like advanced analytics and custom integrations. It does not include exclusive content.',
    details: 'This plan offers comprehensive support and advanced features, excluding exclusive content and some high-end customization options. It is ideal for users needing robust features and priority support.'
  },
  {
    name: 'Premium',
    monthlyPrice: 800,
    yearlyPrice: 8000,
    features: [
      'Priority support - Available',
      'Dedicated account manager - Available',
      'Advanced analytics - Available',
      'Custom integrations - Available',
      'Exclusive content - Available'
    ],
    unavailable: [
      'Additional storage - Not Available',
      'Priority customer support - Not Available'
    ],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    description: 'The Premium plan includes all features of the Pro plan plus exclusive content and the highest level of support, including a dedicated account manager. It is perfect for users who need the most comprehensive support and features.',
    details: 'This plan provides the most extensive range of features and support, including exclusive content and top-tier support services. It does not include some additional features like more storage or personal training.'
  },
];
