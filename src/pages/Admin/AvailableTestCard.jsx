import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AvailableTestCard({ test, endTest }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 relative border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900">
      <div className="absolute top-3 right-3">
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white pr-6">{test.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Created: {new Date(test.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Status: <span className="capitalize">{test.Properties?.status || 'draft'}</span>
      </p>
      <div className="mt-4">
        <button
          onClick={() => endTest(test.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          End Test
        </button>
      </div>
    </div>
  );
}
