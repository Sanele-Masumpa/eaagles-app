"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { plans, Plan } from "@/constants/plans";
import Loader from "@/components/Loader";
import { FaCheckCircle, FaTimesCircle, FaCreditCard, FaListAlt, FaCalendarAlt, FaCalendarCheck, FaCog} from "react-icons/fa";

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
    <div className="w-full px-6 py-12 mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg  overflow-hidden">
        <div className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <h2 className="text-3xl font-bold">Current Plan</h2>
        </div>
        <div className="p-6">
          <div className="border-b border-gray-300 dark:border-gray-700">
            <div className="flex justify-center space-x-6">
              {[
                { name: "Overview", icon: FaListAlt, tab: "overview" },
                { name: "Details", icon: FaCog, tab: "details" },
                { name: "Manage", icon: FaTimesCircle, tab: "manage" },
                { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
              ].map((item) => (
                <button
                  key={item.tab}
                  className={`text-lg font-semibold py-3 px-6 border-b-2 ${
                    activeTab === item.tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-700 dark:text-gray-200"
                  } hover:border-blue-500 focus:outline-none flex items-center`}
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
                      Plan: <span className="font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      {isYearly
                        ? `Yearly - R${currentPlan.yearlyPrice} per year`
                        : `Monthly - R${currentPlan.monthlyPrice} per month`}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Next Billing Date</div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">{subscriptionDetails?.nextBillingDate}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Subscription Start Date</div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">{subscriptionDetails?.subscriptionStartDate}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Status</div>
                    <div
                      className={`text-lg font-bold ${
                        subscriptionDetails?.status === "active" ? "text-green-500" : "text-red-500"
                      } flex items-center`}
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
                <p className="text-center text-gray-700 dark:text-gray-300">You do not have an active plan.</p>
              )
            ) : activeTab === "details" ? (
              currentPlan ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex items-center">
                      <FaListAlt className="mr-2" />
                      <span className="font-semibold">Plan Details:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isYearly ? `Yearly - R${currentPlan.yearlyPrice} per year` : `Monthly - R${currentPlan.monthlyPrice} per month`}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span className="font-semibold">Next Billing Date:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.nextBillingDate}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex items-center">
                      <FaCalendarCheck className="mr-2" />
                      <span className="font-semibold">Subscription Start Date:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {subscriptionDetails?.subscriptionStartDate}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-700 dark:text-gray-300">No details available.</p>
              )
            ) : activeTab === "manage" ? (
              <div className="space-y-6">
                <button
                  onClick={handleCancelSubscription}
                  className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-colors duration-300"
                  aria-label="Cancel Subscription"
                >
                  Cancel Subscription
                </button>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Switch Plan</h3>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-300"
                    aria-label={`Show ${isYearly ? "monthly" : "yearly"} plans`}
                  >
                    {isYearly ? "Show Monthly Plans" : "Show Yearly Plans"}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {availablePlans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`p-6 rounded-lg shadow-md cursor-pointer ${
                          currentPlan?.name === plan.name ? "border-2 border-blue-500" : "border"
                        } bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300`}
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Are you sure you want to switch to the ${plan.name} plan? The last added payment method will be used to complete this transaction.`
                          );
                          if (confirmed) {
                            handleUpdatePlan(plan.stripePriceId);
                          }
                        }}
                        role="button"
                        aria-label={`Switch to ${plan.name} plan`}
                      >
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{plan.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {isYearly ? `R${plan.yearlyPrice} per year` : `R${plan.monthlyPrice} per month`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === "payment" ? (
              paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                      <div className="flex items-center">
                        <FaCreditCard className="mr-2" />
                        <span className="font-semibold">{method.cardBrand}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        **** **** **** {method.last4} - Exp: {method.expMonth}/{method.expYear}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-700 dark:text-gray-300">No payment methods available.</p>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlan;
