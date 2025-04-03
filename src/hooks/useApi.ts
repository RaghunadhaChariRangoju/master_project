import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api/utils';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface ApiHookResult<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * A custom hook for handling API calls with loading and error states
 * 
 * @param apiFunction The API function to call
 * @returns An object with data, loading and error states, and execute/reset functions
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): ApiHookResult<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, isLoading: true, error: null });
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (error) {
        const apiError = error instanceof Error 
          ? error 
          : new Error('An unknown error occurred');
        
        setState({ data: null, isLoading: false, error: apiError });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * A hook for handling paginated data fetching
 */
export function usePaginatedApi<T, F = any>(
  fetchFunction: (filters: F, page: number, pageSize: number) => Promise<T[]>
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<F | null>(null);

  const fetchPage = useCallback(
    async (pageToFetch: number, pageSize: number = 10, newFilters?: F) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filtersToUse = newFilters !== undefined ? newFilters : filters;
        const newData = await fetchFunction(filtersToUse as F, pageToFetch, pageSize);
        
        if (pageToFetch === 1) {
          setData(newData);
        } else {
          setData(prev => [...prev, ...newData]);
        }
        
        setHasMore(newData.length === pageSize);
        setPage(pageToFetch);
        
        if (newFilters !== undefined) {
          setFilters(newFilters);
        }
      } catch (err) {
        const apiError = err instanceof Error 
          ? err 
          : new Error('An unknown error occurred');
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, fetchFunction]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPage(page + 1);
    }
  }, [fetchPage, isLoading, hasMore, page]);

  const refresh = useCallback(() => {
    fetchPage(1);
  }, [fetchPage]);

  const applyFilters = useCallback(
    (newFilters: F) => {
      fetchPage(1, 10, newFilters);
    },
    [fetchPage]
  );

  return {
    data,
    isLoading,
    error,
    page,
    hasMore,
    filters,
    loadMore,
    refresh,
    applyFilters,
  };
}
