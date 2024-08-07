import { title } from "@/components/primitives";
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <main className="container mx-auto px-6">
        <section className="mb-12 text-center">
          <h1 className={`${title()} text-3xl font-bold text-gray-800 dark:text-white`}>Welcome to Eagles Ring</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Join the Premier Platform for Entrepreneurs and Investors</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Connect, innovate, and grow with Eagles Ring. Our platform brings together startups and investors to foster groundbreaking business ideas and opportunities.
          </p>
          <a
            href="/register"
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark inline-block"
          >
            Join Now
          </a>
        </section>

        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <Image
                src="/images/networking.svg"
                alt="Networking"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Why Choose Eagles Ring?</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                At Eagles Ring, we provide a user-friendly platform for entrepreneurs to pitch their innovative ideas and for investors to find promising opportunities. Our mission is to facilitate meaningful connections that drive success.
              </p>
              <a
                href="/about"
                className="text-primary font-semibold hover:underline"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section className="mb-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Our Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Innovative Ideas</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Discover groundbreaking ideas from talented entrepreneurs looking to make an impact.
              </p>
            </div>
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Secure Transactions</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Ensure your investments are safe with our secure and transparent transaction processes.
              </p>
            </div>
            <div className="border rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Effective Communication</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Connect easily with entrepreneurs and investors through our integrated communication tools.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Join Our Community</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Become part of a growing community of innovators and investors. Sign up today and start making meaningful connections.
          </p>
          <a
            href="/register"
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark inline-block"
          >
            Get Started
          </a>
        </section>

        
      </main>
    </div>
  );
}
