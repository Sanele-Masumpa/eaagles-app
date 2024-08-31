'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { currentUser, User } from '@clerk/nextjs/server';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing() {
  const [user, setUser] = useState<User | null>(null); // Initialize state for user
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  useEffect(() => {
    // Fetch current user when the component mounts
    const fetchUser = async () => {
      const user = await currentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleStripeCheckout = async () => {
    setPriceIdLoading('price_id'); // Example price_id, replace with actual ID if needed

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      { id: 'price_id' }, // Example price data, replace with actual data if needed
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
        </div>
        <div className="mt-12 space-y-0 sm:mt-16 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          <div
            className={cn(
              'flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
              'flex-1',
              'basis-1/3',
              'max-w-xs'
            )}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold leading-6 text-white">
                Example Plan
              </h2>
              <p className="mt-4 text-zinc-300">Description of the plan.</p>
              <p className="mt-8">
                <span className="text-5xl font-extrabold white">$20</span>
                <span className="text-base font-medium text-zinc-100">
                  /{billingInterval}
                </span>
              </p>
              <Button
                variant="slim"
                type="button"
                loading={priceIdLoading === 'price_id'}
                onClick={handleStripeCheckout}
                className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}
