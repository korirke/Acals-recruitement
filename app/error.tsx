'use client';

/**
 * ❌ Global Error Page
 */

import ErrorScreen from '@/components/errors/ErrorScreen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      title="Something went wrong"
      message={error.message || 'An unexpected error occurred'}
      onRetry={reset}
    />
  );
}
