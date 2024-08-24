// components/Loader.tsx

"use client";

import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black relative">
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative w-32 h-32">
          {/* Spinning Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full animate-spin text-blue-600 dark:text-blue-400"
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
          </div>
          {/* Background Gradient */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-800 dark:via-blue-900 dark:to-blue-1000 opacity-50 animate-pulse"></div>
          </div>
          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="relative text-xl font-bold text-gray-700 dark:text-gray-300">
              Please Wait...
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
