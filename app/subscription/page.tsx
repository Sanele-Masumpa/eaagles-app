'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Feature {
  description: string;
  included: boolean;
}

interface Plan {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  features: Feature[];
  stripePriceId: string | { monthly: string; yearly: string };
  buttonLabel: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    priceMonthly: '0 ZAR',
    priceYearly: '0 ZAR',
    features: [
      { description: 'Basic access to the platform', included: true },
      { description: 'Limited number of pitches', included: true },
      { description: 'Access to community forums', included: true },
      { description: 'Priority support', included: false },
      { description: 'Enhanced pitch visibility', included: false },
      { description: 'Monthly performance insights', included: false },
      { description: 'Dedicated account manager', included: false },
      { description: 'Custom analytics reports', included: false },
      { description: 'Exclusive networking events', included: false },
      { description: 'Early access to new features', included: false },
    ],
    stripePriceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
    buttonLabel: 'Join for Free',
  },
  {
    name: 'Pro',
    priceMonthly: '450 ZAR',
    priceYearly: '4500 ZAR',
    features: [
      { description: 'Basic access to the platform', included: true },
      { description: 'Limited number of pitches', included: true },
      { description: 'Access to community forums', included: true },
      { description: 'Priority support', included: true },
      { description: 'Enhanced pitch visibility', included: true },
      { description: 'Monthly performance insights', included: true },
      { description: 'Dedicated account manager', included: false },
      { description: 'Custom analytics reports', included: false },
      { description: 'Exclusive networking events', included: false },
      { description: 'Early access to new features', included: false },
    ],
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PRO_ANNUAL_PRICE_ID!,
    },
    buttonLabel: 'Subscribe Now',
  },
  {
    name: 'Premium',
    priceMonthly: '800 ZAR',
    priceYearly: '8000 ZAR',
    features: [
      { description: 'Basic access to the platform', included: true },
      { description: 'Limited number of pitches', included: true },
      { description: 'Access to community forums', included: true },
      { description: 'Priority support', included: true },
      { description: 'Enhanced pitch visibility', included: true },
      { description: 'Monthly performance insights', included: true },
      { description: 'Dedicated account manager', included: true },
      { description: 'Custom analytics reports', included: true },
      { description: 'Exclusive networking events', included: true },
      { description: 'Early access to new features', included: true },
    ],
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
      yearly: process.env.NEXT_PUBLIC_PREMIUM_ANNUAL_PRICE_ID!,
    },
    buttonLabel: 'Subscribe Now',
  },
];

const SubscriptionForm = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPlan) {
      toast.error('Please select a plan.');
      return;
    }

    const selectedPlanData = plans.find(plan => plan.name === selectedPlan);
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
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.message}`);
        setIsLoading(false);
        return;
      }

      const stripe = await stripePromise;
      const { error } = await stripe?.redirectToCheckout({ sessionId: data.id }) || {};

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
        >
          Monthly
        </button>
        <button
          className={`px-6 py-3 rounded-r-md text-lg font-medium transition-all duration-300 ${isYearly ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setIsYearly(true)}
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
              onClick={() => handlePlanSelect(plan.name)}
            >
              <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-extrabold mb-4">
                {isYearly ? `${plan.priceYearly}` : `${plan.priceMonthly}`} {isYearly ? 'per year' : 'per month'}
              </p>
              <ul className="mb-6">
                {plan.features.map(feature => (
                  <li key={feature.description} className="flex items-center mb-2">
                    {feature.included ? (
                      <svg
                        className="w-6 h-6 mr-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 mr-3 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {feature.description}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 ${selectedPlan === plan.name ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gray-300 text-gray-700'}`}
                onClick={() => handlePlanSelect(plan.name)}
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
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              </svg>
              Loading...
            </span>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
