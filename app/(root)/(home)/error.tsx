"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-100">
      <Image
        src="/images/EaglesRingLogo.png"
        alt="Eagles Ring Logo"
        width={150}
        height={150}
        className="mb-8 dark:bg-white"
      />
      <h2 className="text-2xl font-bold mb-4">Oops, something went wrong!</h2>
      <p className="mb-6 text-center">
        We apologize for the inconvenience. An unexpected error has occurred.
        Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition"
      >
        Try Again
      </button>
    </div>
  );
}
