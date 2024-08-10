import React from "react";
import Link from "next/link";
import { FaSadTear } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div
      className="text-center text-gray-600 dark:text-gray-400"
      role="contentinfo"
    >
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-6">
        <span role="img" aria-label="confused">
          🤔
        </span>{" "}
        <span className="text-gray-600 dark:text-gray-400">
          Sicela, uzame le page ebheke lapho!
        </span>
      </p>
      <a
        href="/"
        className="text-primary font-semibold hover:underline"
      >
        Return to Home
      </a>
    </div>
  );
};

export default NotFoundPage;

