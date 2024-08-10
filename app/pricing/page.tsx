import React from "react";

interface IconProps {
  className?: string;
}

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M14.293 6.293a1 1 0 00-1.414 0L8 9.586 7.121 8.707a1 1 0 00-1.414 1.414l1.5 1.5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6.293 6.293a1 1 0 011.414 0L10 7.586l2.293-2.293a1 1 0 111.414 1.414L11.414 9l2.293 2.293a1 1 0 01-1.414 1.414L10 10.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 9 6.293 6.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PricingPage() {
  return (
    <div className="max-w-full px-6 py-8 mx-auto">
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Our Pricing Plans
        </h2>
        <p className="text-lg mb-8 text-center">
          At Eagles Ring, we offer flexible pricing plans to suit the needs of both entrepreneurs
          and investors. Our goal is to provide excellent value and support at every stage of your
          investment journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto py-12 px-4 md:px-0">
          {/* Basic Plan */}
          <div className="bg-gray-100 dark:bg-[#917953] rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Basic Plan</h3>
              <div className="text-4xl font-bold text-black">-</div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Get started with our basic plan for small teams.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Pitch Guide Videos</span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <XIcon className="h-5 w-5 text-destructive" />
                <span className="line-through text-black">
                  Unlimited Business Assistance
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <XIcon className="h-5 w-5 text-destructive" />
                <span className="line-through text-black">
                  Unlimited Business Events
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <XIcon className="h-5 w-5 text-destructive" />
                <span className="line-through text-black">Priority Support</span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <XIcon className="h-5 w-5 text-destructive" />
                <span className="line-through text-black">Chat Enabled</span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <XIcon className="h-5 w-5 text-destructive" />
                <span className="line-through text-black">
                  Business Pitch Guidance
                </span>
              </div>
            </div>
            <a
              href="/sign-up"
              className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform transition duration-300 hover:scale-105 text-center py-2 px-4 rounded-lg text-white"
            >
              Get Started
            </a>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-100 dark:bg-[#917953] rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Premium Plan</h3>
              <div className="text-4xl font-bold text-black">R450</div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Our premium plan offers advanced features for growing teams.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Basic Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Unlimited Business Assistance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Unlimited Business Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Priority Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Chat Enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Business Pitch Guidance</span>
              </div>
            </div>
            <a
              href="/sign-up"
              className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform transition duration-300 hover:scale-105 text-center py-2 px-4 rounded-lg text-white"
            >
              Get Started
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-100 dark:bg-[#917953] rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Enterprise Plan</h3>
              <div className="text-4xl font-bold text-black">Custom</div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Tailored solutions for large organizations with advanced needs.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">All Premium Plan Features</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Dedicated Account Manager</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">Custom Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">On-site Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span className="text-black">24/7 Support</span>
              </div>
            </div>
            <a
              href="/contact"
              className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform transition duration-300 hover:scale-105 text-center py-2 px-4 rounded-lg text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
