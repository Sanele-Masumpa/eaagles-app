'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/get-user-role');
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch user role', error);
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role === 'INVESTOR') {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
        <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Investor Dashboard</h1>
          <p className="text-xl mb-8">
            Welcome to your investor dashboard! Here you can find potential startups to invest in.
          </p>
          {/* Additional content for Investor Dashboard */}
          <section className="mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your Investments</h2>
            <p className="text-lg mb-6">
              Track and manage your investments here. View detailed information about each investment.
            </p>
            {/* List or other components to display investments */}
          </section>
        </main>
      </div>
    );
  }

  if (role === 'ENTREPRENEUR') {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
        <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Entrepreneur Dashboard</h1>
          <p className="text-xl mb-8">
            Welcome to your entrepreneur dashboard! Here you can pitch your ideas to potential investors.
          </p>
          {/* Additional content for Entrepreneur Dashboard */}
          <section className="mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your Pitches</h2>
            <p className="text-lg mb-6">
              Manage and review your pitches here. Keep track of the status and feedback from investors.
            </p>
            {/* List or other components to display pitches */}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <main className="flex flex-col items-center justify-center w-full h-full px-6 py-16 text-center">
        <section className="mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Eagles Ring</h1>
          <h2 className="text-3xl font-semibold mb-6">
            Join the Premier Platform for Entrepreneurs and Investors
          </h2>
          <p className="text-xl mb-8">
            Connect, innovate, and grow with Eagles Ring. Our platform brings together startups and investors to foster groundbreaking business ideas and opportunities.
          </p>
          <a
            href="/sign-up"
            className="bg-primary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300"
          >
            Join Now
          </a>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-8 mb-12 max-w-4xl mx-auto">
          <div className="md:w-1/2">
            <Image
              src="/images/networking.svg"
              alt="Networking"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-4">Why Choose Eagles Ring?</h3>
            <p className="text-lg mb-6">
              At Eagles Ring, we provide a user-friendly platform for entrepreneurs to pitch their innovative ideas and for investors to find promising opportunities. Our mission is to facilitate meaningful connections that drive success.
            </p>
            <a
              href="/about"
              className="text-primary font-semibold hover:underline"
            >
              Learn More
            </a>
          </div>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6">Our Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-black">
              <h4 className="text-lg font-semibold mb-2">Innovative Ideas</h4>
              <p>
                Discover groundbreaking ideas from talented entrepreneurs looking to make an impact.
              </p>
            </div>
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-black">
              <h4 className="text-lg font-semibold mb-2">Secure Transactions</h4>
              <p>
                Ensure your investments are safe with our secure and transparent transaction processes.
              </p>
            </div>
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-black">
              <h4 className="text-lg font-semibold mb-2">Effective Communication</h4>
              <p>
                Connect easily with entrepreneurs and investors through our integrated communication tools.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6">Join Our Community</h3>
          <p className="text-lg mb-8">
            Become part of a growing community of innovators and investors. Sign up today and start making meaningful connections.
          </p>
          <a
            href="/sign-up"
            className="bg-primary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300"
          >
            Get Started
          </a>
        </section>
      </main>
    </div>
  );
}
