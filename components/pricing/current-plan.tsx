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
   <div className="flex h-screen">
  <aside className="w-64 bg-gray-800 text-white flex flex-col">
    <div className="flex items-center justify-center py-6 bg-gradient-to-r from-blue-600 to-purple-600">
      <h2 className="text-3xl font-bold">Current Plan</h2>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-1">
      {[
        { name: "Overview", icon: FaListAlt, tab: "overview" },
        { name: "Details", icon: FaCog, tab: "details" },
        { name: "Manage", icon: FaTimesCircle, tab: "manage" },
        { name: "Payment Methods", icon: FaCreditCard, tab: "payment" },
      ].map((item) => (
        <button
          key={item.tab}
          className={`flex items-center px-4 py-3 w-full text-left rounded-lg ${
            activeTab === item.tab
              ? "bg-blue-500"
              : "hover:bg-gray-700 transition-colors duration-300"
          }`}
          onClick={() => setActiveTab(item.tab as 'overview' | 'details' | 'manage' | 'payment')}
          role="tab"
          aria-selected={activeTab === item.tab}
        >
          <item.icon className="mr-3" />
          {item.name}
        </button>
      ))}
    </nav>
  </aside>
  <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
    <div className="max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : activeTab === "overview" ? (
        currentPlan ? (
          <div className="space-y-6">
            {/* Overview content */}
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">You do not have an active plan.</p>
        )
      ) : activeTab === "details" ? (
        <div className="space-y-6">
          {/* Details content */}
        </div>
      ) : activeTab === "manage" ? (
        <div className="space-y-6">
          {/* Manage content */}
        </div>
      ) : activeTab === "payment" ? (
        <div className="space-y-6">
          {/* Payment Methods content */}
        </div>
      ) : null}
    </div>
  </main>
</div>
  );
};

export default CurrentPlan;
