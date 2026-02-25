'use client';

/**
 * 💥 Admin Error Boundary
 * Catches and handles errors in admin panel
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AdminErrorBoundary caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-center text-neutral-900 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
