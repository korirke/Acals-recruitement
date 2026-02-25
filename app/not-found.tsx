/**
 * 404 Not Found Page
 */
"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
