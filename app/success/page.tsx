'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { title } from "@/components/primitives";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to home or another page after a delay
    }, 3000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
      <div className="p-8 bg-white dark:bg-black rounded-lg shadow-lg border-2 border-blue-500 space-y-6 max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className={`${title()} text-center text-3xl font-bold text-gray-900 dark:text-gray-100`}>
          Success!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Your role has been successfully assigned. You will be redirected shortly.
        </p>
        <a
          href="/"
          className="block w-full text-center bg-blue text-white py-2 px-4 rounded-lg hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
