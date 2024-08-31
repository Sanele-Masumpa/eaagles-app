"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { plans, Plan } from "@/constants/plans";
import Loader from "@/components/Loader";
import { FaCheckCircle, FaTimesCircle, FaCreditCard, FaListAlt, FaCalendarAlt, FaCalendarCheck, FaCog } from "react-icons/fa";

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
              const plan = plans.find(
                (plan) =>
                  plan.stripePriceId === data.currentPlan ||
                  (typeof plan.stripePriceId === "object" &&
                    (plan.stripePriceId.monthly === data.currentPlan || plan.stripePriceId.yearly === data.currentPlan))
              );
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
            toast.error(data.message || "An error occurred while fetching the subscription plan.");
          }
        } catch (error) {
          console.error("Error fetching current plan:", error);
          toast.error("An unexpected error occurred.");
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
          const response = await fetch("/api/cancel-subscription", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
          });

          const data = await response.json();

          if (response.ok) {
            setCurrentPlan(null);
            toast.success("Subscription canceled successfully.");
          } else {
            toast.error(data.message || "Error canceling subscription.");
          }
        } catch (error) {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const handleUpdatePlan = async (newPlanId: string | { monthly: string; yearly: string }) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const planId = typeof newPlanId === "string" ? newPlanId : isYearly ? newPlanId.yearly : newPlanId.monthly;
        const response = await fetch("/api/update-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            newPlanId: planId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setCurrentPlan(plans.find((plan) => plan.stripePriceId === planId) || null);
          toast.success("Plan updated successfully.");
        } else {
          toast.error(data.message || "Error updating plan.");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <h2 className="text-xl sm:text-3xl font-bold">Current Plan</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="border-b border-gray-300 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              {[
                { name: "Overview", icon: FaListAlt, tab: "overview" },
                { name: "Details", icon: FaCog, tab: "details" },
                { name: "Manage", icon: FaTimesCircle, tab: "manage" },
                { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
              ].map((item) => (
                <button
                  key={item.tab}
                  className={text-base sm:text-lg font-semibold py-2 sm:py-3 px-4 sm:px-6 border-b-2 ${
                    activeTab === item.tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-700 dark:text-gray-200"
                  } hover:border-blue-500 focus:outline-none flex items-center}
                  onClick={() => setActiveTab(item.tab as 'overview' | 'details' | 'manage' | 'payment')}
                  role="tab"
                  aria-selected={activeTab === item.tab}
                >
                  <item.icon className="mr-2" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-15rem)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40 sm:h-48">
                <Loader />
              </div>
            ) : activeTab === "overview" ? (
              currentPlan ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Plan: <span className="font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {isYearly
                        ? Yearly - R${currentPlan.yearlyPrice} per year
                        : Monthly - R${currentPlan.monthlyPrice} per month}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Next Billing Date</div>
                    <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{subscriptionDetails?.nextBillingDate}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Subscription Start Date</div>
                    <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">{subscriptionDetails?.subscriptionStartDate}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Status</div>
                    <div
                      className={text-base sm:text-lg font-bold ${
                        subscriptionDetails?.status === "active" ? "text-green-500" : "text-red-500"
                      } flex items-center}
                    >
                      {subscriptionDetails?.status === "active" ? (
                        <>
                          <FaCheckCircle className="mr-2" /> Active
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-2" /> Inactive
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-400">
                  No active subscription found. You can <a href="/subscribe" className="text-blue-600 dark:text-blue-400 hover:underline">subscribe here</a>.
                </div>
              )
            ) : activeTab === "details" ? (
              <div className="space-y-4 sm:space-y-6">
                {currentPlan ? (
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Plan Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaListAlt className="mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">Features:</span>
                      </div>
                      <ul className="list-disc list-inside pl-5">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400">{feature}</li>
                        ))}
                      </ul>
                      {currentPlan.unavailableFeatures.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center">
                            <FaTimesCircle className="mr-2 text-red-500 dark:text-red-400" />
                            <span className="text-red-500 dark:text-red-400 font-semibold">Unavailable Features:</span>
                          </div>
                          <ul className="list-disc list-inside pl-5">
                            {currentPlan.unavailableFeatures.map((feature, index) => (
                              <li key={index} className="text-red-500 dark:text-red-400">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    No plan details available. Please <a href="/subscribe" className="text-blue-600 dark:text-blue-400 hover:underline">subscribe here</a>.
                  </div>
                )}
              </div>
            ) : activeTab === "manage" ? (
              <div className="space-y-4 sm:space-y-6">
                {currentPlan ? (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => handleUpdatePlan(currentPlan.stripePriceId)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    >
                      Update Plan
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    No active subscription found. You can <a href="/subscribe" className="text-blue-600 dark:text-blue-400 hover:underline">subscribe here</a>.
                  </div>
                )}
              </div>
            ) : activeTab === "payment" ? (
              <div className="space-y-4 sm:space-y-6">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                      <FaCreditCard className="mr-4 text-gray-600 dark:text-gray-400" />
                      <div>
                        <div className="text-gray-800 dark:text-gray-200 font-semibold">Card Brand:</div>
                        <div className="text-gray-600 dark:text-gray-400">{method.brand}</div>
                        <div className="text-gray-800 dark:text-gray-200 font-semibold mt-2">Card Last 4 Digits:</div>
                        <div className="text-gray-600 dark:text-gray-400">{method.last4}</div>
                        <div className="text-gray-800 dark:text-gray-200 font-semibold mt-2">Expiration Date:</div>
                        <div className="text-gray-600 dark:text-gray-400">{${method.expMonth}/${method.expYear}}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    No payment methods available. Please add a payment method in your <a href="/account" className="text-blue-600 dark:text-blue-400 hover:underline">account settings</a>.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlan;
