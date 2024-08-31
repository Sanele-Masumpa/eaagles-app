"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { plans, Plan } from '@/constants/plans';
import Loader from '@/components/Loader';
import { FaCalendarAlt, FaDollarSign, FaCreditCard, FaTools, FaInfoCircle } from 'react-icons/fa';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

const CurrentPlan = () => {
  const { user } = useUser();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    nextBillingDate: string;
    subscriptionStartDate: string;
    status: string;
  } | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'manage' | 'payment'>('overview');
  const [availablePlans, setAvailablePlans] = useState<Plan[]>(plans);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const response = await fetch(`/api/current-subscription?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
          const data = await response.json();

          if (response.ok) {
            if (data.currentPlan) {
              const plan = plans.find(plan => plan.stripePriceId === data.currentPlan ||
                                                (typeof plan.stripePriceId === 'object' &&
                                                 (plan.stripePriceId.monthly === data.currentPlan ||
                                                  plan.stripePriceId.yearly === data.currentPlan)));
              setCurrentPlan(plan || null);
              setIsYearly(data.isYearly);
              setSubscriptionDetails({
                nextBillingDate: new Date(data.nextBillingDate * 1000).toLocaleDateString(),
                subscriptionStartDate: new Date(data.subscriptionStartDate * 1000).toLocaleDateString(),
                status: data.status,
              });
              setPaymentMethods(data.paymentMethods);
            }
          } else {
            toast.error(data.message || 'An error occurred while fetching the subscription plan.');
          }
        } catch (error) {
          console.error('Error fetching current plan:', error);
          toast.error('An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCurrentPlan();
  }, [user?.primaryEmailAddress?.emailAddress]);

  const handleCancelSubscription = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const confirmed = window.confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone, and any money paid will not be refunded."
      );

      if (confirmed) {
        try {
          const response = await fetch('/api/cancel-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
          });

          const data = await response.json();

          if (response.ok) {
            setCurrentPlan(null);
            toast.success('Subscription canceled successfully.');
          } else {
            toast.error(data.message || 'Error canceling subscription.');
          }
        } catch (error) {
          toast.error('An unexpected error occurred.');
        }
      }
    }
  };

  const handleUpdatePlan = async (newPlanId: string | { monthly: string; yearly: string }) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const planId = typeof newPlanId === 'string' ? newPlanId : isYearly ? newPlanId.yearly : newPlanId.monthly;
        const response = await fetch('/api/update-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            newPlanId: planId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCurrentPlan(plans.find(plan => plan.stripePriceId === planId) || null);
          toast.success('Plan updated successfully.');
        } else {
          toast.error(data.message || 'Error updating plan.');
        }
      } catch (error) {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="max-w-full px-6 py-12 mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <h2 className="text-3xl font-bold">Current Plan</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row border-b border-gray-300 dark:border-gray-700">
            <button
              className={`flex-1 text-lg font-semibold py-3 px-6 border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-700 dark:text-gray-200'} hover:border-blue-500 focus:outline-none`}
              onClick={() => setActiveTab('overview')}
            >
              <FaInfoCircle className="inline-block mr-2" /> Overview
            </button>
            <button
              className={`flex-1 text-lg font-semibold py-3 px-6 border-b-2 ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-700 dark:text-gray-200'} hover:border-blue-500 focus:outline-none`}
              onClick={() => setActiveTab('details')}
            >
              <FaCalendarAlt className="inline-block mr-2" /> Details
            </button>
            <button
              className={`flex-1 text-lg font-semibold py-3 px-6 border-b-2 ${activeTab === 'manage' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-700 dark:text-gray-200'} hover:border-blue-500 focus:outline-none`}
              onClick={() => setActiveTab('manage')}
            >
              <FaTools className="inline-block mr-2" /> Manage
            </button>
            <button
              className={`flex-1 text-lg font-semibold py-3 px-6 border-b-2 ${activeTab === 'payment' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-700 dark:text-gray-200'} hover:border-blue-500 focus:outline-none`}
              onClick={() => setActiveTab('payment')}
            >
              <FaCreditCard className="inline-block mr-2" /> Payment Methods
            </button>
          </div>
          <div className="p-6 space-y-6 max-h-[calc(100vh-15rem)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader />
              </div>
            ) : activeTab === 'overview' ? (
              currentPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <FaInfoCircle className="inline-block mr-2" /> Plan: <span className="font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {isYearly ? `Yearly - R${currentPlan.yearlyPrice} per year` : `Monthly - R${currentPlan.monthlyPrice} per month`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <FaCalendarAlt className="inline-block mr-2" /> Next Billing Date
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.nextBillingDate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <FaCalendarAlt className="inline-block mr-2" /> Subscription Start Date
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.subscriptionStartDate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <FaInfoCircle className="inline-block mr-2" /> Status
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.status}
                    </div>
                  </div>
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">No active subscription found.</p>
              )
            ) : activeTab === 'details' ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Plan Details
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">Detailed information about your current plan will be displayed here.</p>
                </div>
              </div>
            ) : activeTab === 'manage' ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Manage Subscription
                  </h3>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    onClick={() => handleUpdatePlan(currentPlan?.stripePriceId || '')}
                  >
                    Update Plan
                  </button>
                </div>
              </div>
            ) : activeTab === 'payment' ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Payment Methods
                  </h3>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                        <div className="text-lg text-gray-700 dark:text-gray-300">
                          {method.cardBrand} ending in {method.last4}
                        </div>
                        <button
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                          onClick={() => {/* Handle remove payment method */}}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">No payment methods found.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlan;
