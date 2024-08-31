"use client";

import { useState, useEffect } from 'react';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import CurrentPlan from '@/components/pricing/current-plan';
import { plans, Plan } from '@/constants/plans'; // Adjust the import path as necessary

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SubscriptionForm = () => {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
  }, [user?.primaryEmailAddress?.emailAddress]);

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
      <h1 className="text-4xl font-extrabold mb-8 text-center">Subscription Plans</h1>

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
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-lg font-bold mb-4">
                {isYearly ? `R${plan.yearlyPrice}` : `R${plan.monthlyPrice}`} {isYearly ? 'per year' : 'per month'}
              </p>
              <ul className="list-disc list-inside mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
                {plan.unavailable.map((feature, index) => (
                  <li key={index} className="text-gray-500 line-through">{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-300 ${selectedPlan === plan.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-300 ${selectedPlan ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!selectedPlan || isLoading}
        >
          {isLoading ? 'Processing...' : 'Subscribe'}
        </button>
      </form>

      <SignedIn>
        <CurrentPlan />
      </SignedIn>
    </div>
  );
};

export default SubscriptionForm;
