"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { plans, Plan } from "@/constants/plans";
import Loader from "@/components/Loader";
import { FaListAlt, FaCalendarAlt, FaCalendarCheck, FaCreditCard, FaCog, FaTimesCircle } from "react-icons/fa";

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
    <div className="max-w-5xl px-6 py-12 mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <h2 className="text-3xl font-bold">Current Plan</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row border-b border-gray-300 dark:border-gray-700">
            {[
              { name: "Overview", icon: FaListAlt, tab: "overview" },
              { name: "Details", icon: FaCalendarAlt, tab: "details" },
              { name: "Manage", icon: FaCog, tab: "manage" },
              { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
            ].map((item) => (
              <button
                key={item.tab}
                className={`flex-1 text-lg font-semibold py-3 px-6 border-b-2 ${
                  activeTab === item.tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-700 dark:text-gray-200"
                } hover:border-blue-500 focus:outline-none flex items-center justify-center`}
                onClick={() => setActiveTab(item.tab as 'overview' | 'details' | 'manage' | 'payment')}
                role="tab"
                aria-selected={activeTab === item.tab}
              >
                <item.icon className="mr-2 text-xl" />
                {item.name}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-6 max-h-[calc(100vh-15rem)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader />
              </div>
            ) : activeTab === "overview" ? (
              currentPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <strong>Plan:</strong> <span className="font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <strong>Status:</strong> <span className="font-bold capitalize">{subscriptionDetails?.status}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Subscription Details</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Start Date:</strong> {subscriptionDetails?.subscriptionStartDate}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Next Billing Date:</strong> {subscriptionDetails?.nextBillingDate}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">You are not currently subscribed to any plan.</p>
              )
            ) : activeTab === "details" ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Plan Details</h3>
                <div className="space-y-4">
                  {currentPlan && (
                    <>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Plan Name:</strong> {currentPlan.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Description:</strong> {currentPlan.description}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Price:</strong> {currentPlan.price}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : activeTab === "manage" ? (
              <div>
                {currentPlan ? (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-300"
                    >
                      Cancel Subscription
                    </button>
                    <button
                      onClick={() => handleUpdatePlan(currentPlan.stripePriceId)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-300"
                    >
                      Update Plan
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">You are not currently subscribed to any plan.</p>
                )}
              </div>
            ) : activeTab === "payment" ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
                {paymentMethods.length > 0 ? (
                  <ul className="space-y-4">
                    {paymentMethods.map((pm) => (
                      <li key={pm.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                          <FaCreditCard className="text-gray-700 dark:text-gray-300" />
                          <div>
                            <p className="text-gray-800 dark:text-gray-200">
                              <strong>Card Brand:</strong> {pm.brand}
                            </p>
                            <p className="text-gray-800 dark:text-gray-200">
                              <strong>Last 4 Digits:</strong> {pm.last4}
                            </p>
                            <p className="text-gray-800 dark:text-gray-200">
                              <strong>Expiration Date:</strong> {pm.expMonth}/{pm.expYear}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No payment methods found.</p>
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
