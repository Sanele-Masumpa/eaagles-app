"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { title } from "@/components/primitives";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Launch confetti when the component is mounted
    confetti({
      particleCount: 300,
      spread: 160,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#FFD700', '#FF69B4', '#FF4500', '#1E90FF'],
      shapes: ['circle', 'square'],
    });

    // Redirect after a delay
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home or another page
    }, 4000); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-white dark:bg-gradient-to-br dark:from-blue-800 dark:to-black">
      <div className="p-8  bg-gradient-to-br from-gray-50 to-blue-300 dark:bg-gradient-to-br dark:from-black dark:to-blue-800 rounded-lg shadow-2xl border-1 border-blue-200 space-y-6 max-w-md">
        <div className="flex justify-center">
          <svg
            className="h-16 w-16 text-green-500"
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
        </div>
        <h1 className={`${title()} text-center text-4xl font-extrabold text-gold dark:text-gold`}>
          Success!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center text-xl">
          Your role has been successfully assigned. You will be redirected shortly.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:opacity-90 transition-opacity duration-300 shadow-lg"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
