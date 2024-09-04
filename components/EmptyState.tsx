import React from 'react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{message}</h2>
        <p className="text-gray-600 dark:text-gray-300">It looks like there are no items to display at the moment.</p>
      </div>
    </div>
  );
};

export default EmptyState;
