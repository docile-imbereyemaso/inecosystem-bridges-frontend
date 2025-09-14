import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <FiLock className="text-red-500 dark:text-red-300 w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          403 Forbidden
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Sorry, you do not have permission to access this page.
          <br />
          If you believe this is a mistake, please contact your administrator.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          <FiArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;