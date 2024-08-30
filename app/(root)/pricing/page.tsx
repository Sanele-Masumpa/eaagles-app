'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PriceId = string | { monthly: string; yearly: string };

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  unavailable: string[];
  buttonLabel: string;
  stripePriceId: PriceId;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['Access to forums', 'Basic support', 'Free Plan'],
    unavailable: [],
    buttonLabel: 'Join for Free',
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
  },
  {
    name: 'Pro',
    monthlyPrice: 450,
    yearlyPrice: 4500,
    features: ['Access to forums', 'Premium content', 'Priority support'],
    unavailable: ['Dedicated account manager'],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
  },
  {
    name: 'Premium',
    monthlyPrice: 800,
    yearlyPrice: 8000,
    features: ['Access to forums', 'Premium content', 'Priority support', 'Dedicated account manager'],
    unavailable: [],
    buttonLabel: 'Subscribe Now',
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
  },
];

const SubscriptionForm = () => {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!selectedPlan || !user?.id || !userEmail) {
      toast.error('Please select a plan and ensure you are logged in.');
      return;
    }

    const selectedPlanData = plans.find((plan) => plan.name === selectedPlan);
    if (!selectedPlanData) {
      toast.error('Invalid plan selected.');
      return;
    }

    const priceId = typeof selectedPlanData.stripePriceId === 'string'
      ? selectedPlanData.stripePriceId
      : isYearly
      ? selectedPlanData.stripePriceId.yearly
      : selectedPlanData.stripePriceId.monthly;

    if (!priceId) {
      toast.error('Invalid price ID.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId: user.id, email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`);
        setIsLoading(false);
        return;
      }

      const stripe = await stripePromise;
      const { error } = (await stripe?.redirectToCheckout({ sessionId: data.id })) || {};

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Choose Your Subscription Plan</h1>
      <div className="flex justify-center mb-6 space-x-2">
        <button
          className={`px-6 py-3 rounded-l-md text-lg font-medium transition-all duration-300 ${!isYearly ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setIsYearly(false)}
          aria-pressed={!isYearly}
        >
          Monthly
        </button>
        <button
          className={`px-6 py-3 rounded-r-md text-lg font-medium transition-all duration-300 ${isYearly ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setIsYearly(true)}
          aria-pressed={isYearly}
        >
          Yearly
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 transition-transform duration-300 ${selectedPlan === plan.name ? 'border-blue-600 shadow-lg transform scale-105' : 'border-gray-300'}`}
              role="button"
              tabIndex={0}
              onClick={() => handlePlanSelect(plan.name)}
              onKeyPress={(e) => e.key === 'Enter' && handlePlanSelect(plan.name)}
              aria-label={`Select ${plan.name} plan`}
            >
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-extrabold mb-4">
                {isYearly ? `R${plan.yearlyPrice}` : `R${plan.monthlyPrice}`} {isYearly ? 'per year' : 'per month'}
                {isYearly && plan.yearlyPrice < (plan.monthlyPrice * 12) ? (
                  <span className="text-red-500 text-sm ml-2">(Save {(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)})</span>
                ) : null}
              </p>
              <ul className="mb-6">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center mb-2 text-green-600">
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.unavailable.map(item => (
                  <li key={item} className="flex items-center mb-2 text-gray-500">
                    <svg
                      className="w-6 h-6 mr-3 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 ${selectedPlan === plan.name ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gray-300 text-gray-700'}`}
                onClick={() => handlePlanSelect(plan.name)}
                aria-pressed={selectedPlan === plan.name}
                aria-label={`Select ${plan.name} plan`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold shadow-lg hover:opacity-90 transition-opacity duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
          aria-label="Proceed to payment"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v8l4 4" />
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
