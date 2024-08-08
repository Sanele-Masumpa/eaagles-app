'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after a few seconds
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to home or another page after a delay
    }, 3000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
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
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Success!</h1>
        <p className="text-gray-600 mt-2">
          Your role has been successfully assigned. You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
