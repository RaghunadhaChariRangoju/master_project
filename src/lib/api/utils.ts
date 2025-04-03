import { PostgrestError } from '@supabase/supabase-js';

export class ApiError extends Error {
  public status: number;
  public originalError?: PostgrestError;
  
  constructor(message: string, status = 500, originalError?: PostgrestError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.originalError = originalError;
  }
}

/**
 * Handles errors from Supabase and transforms them into standardized ApiErrors
 */
export function handleApiError(error: PostgrestError | Error | unknown, context: string): never {
  console.error(`API Error [${context}]:`, error);
  
  if (error instanceof ApiError) {
    throw error;
  }
  
  // Handle PostgrestError
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    const status = getStatusCodeFromPgError(pgError);
    throw new ApiError(pgError.message, status, pgError);
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    throw new ApiError(error.message || `Error in ${context}`);
  }
  
  // Handle unknown errors
  throw new ApiError(`Unknown error occurred in ${context}`);
}

/**
 * Maps PostgreSQL error codes to HTTP status codes
 */
function getStatusCodeFromPgError(error: PostgrestError): number {
  if (!error.code) return 500;
  
  // Map common Postgres error codes to HTTP status codes
  switch (error.code) {
    case '23505': return 409; // Unique violation -> Conflict
    case '23503': return 400; // Foreign key violation -> Bad request
    case '22P02': return 400; // Invalid text representation -> Bad request
    case 'PGRST116': return 404; // Results contain 0 rows -> Not found
    default: return 500;
  }
}

/**
 * Wraps an API call with error handling
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, `${context}(${args.map(a => JSON.stringify(a)).join(', ')})`);
    }
  };
}

/**
 * Checks if the result has an error and throws it
 */
export function handleResult<T>(result: { data: T | null; error: PostgrestError | null }, context: string): T {
  if (result.error) {
    handleApiError(result.error, context);
  }
  
  return result.data as T;
}
