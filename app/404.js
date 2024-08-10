import React from "react";
import Link from "next/link";
import { FaSadTear } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <FaSadTear className="text-6xl mb-6 text-red-500 dark:text-red-400" />
      <h1 className="text-5xl font-extrabold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
      </p>
      <p className="text-lg mb-6">
        <span role="img" aria-label="confused">🤔</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">
          Sicela, uzame le page ebheke lapho!
        </span>
      </p>
      <Link href="/">
        <span className="bg-gold text-black dark:text-white py-2 px-4 rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 transition">
          Go Back to Home
        </span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
