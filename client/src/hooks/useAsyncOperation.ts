import { useState, useCallback } from 'react';
import { useAsyncError } from '@/components/layout/async-error-boundary';

interface UseAsyncOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useAsyncOperation<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
): AsyncOperationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { captureError, resetError } = useAsyncError();

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        resetError();

        const result = await asyncFn(...args);
        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        captureError(error);

        if (options.onError) {
          options.onError(error);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, options, captureError, resetError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    resetError();
  }, [resetError]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}