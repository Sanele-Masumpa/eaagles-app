"use client";

import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative w-24 h-24">
          {/* Spinning Loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm2 0a6 6 0 1112 0 6 6 0 01-12 0z"
              />
            </svg>
          </div>
          {/* Background Gradient */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-600 opacity-60 animate-pulse"></div>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-lg font-semibold text-white dark:text-gray-200">
                Loading...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
