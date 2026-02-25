'use client';

/**
 * ❌ Error Screen Component
 * Displays user-friendly error messages
 */

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  statusCode?: number;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export default function ErrorScreen({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  statusCode,
  onRetry,
  showHomeButton = true,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Status Code */}
        {statusCode && (
          <p className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
            {statusCode}
          </p>
        )}

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}

          {showHomeButton && (
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
