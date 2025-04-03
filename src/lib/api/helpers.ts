import { PostgrestError } from '@supabase/supabase-js';
import { handleApiError } from './utils';

// Type aliases to work with Supabase queries
type PostgrestQuery<T> = {
  then: Function;
  single: () => PostgrestQuery<T>;
  maybeSingle: () => PostgrestQuery<T>;
};

type PostgrestResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

/**
 * Helper to execute a query and handle errors consistently
 */
export async function executeQuery<T>(
  query: PostgrestQuery<T>,
  context: string
): Promise<T | null> {
  try {
    const { data, error } = await query as unknown as PostgrestResponse<T>;
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, context);
    return null; // This line is only reached if handleApiError doesn't throw
  }
}

/**
 * Helper to execute a single-row query
 */
export async function executeSingleQuery<T>(
  query: PostgrestQuery<T>,
  context: string,
  allowNotFound = false
): Promise<T | null> {
  try {
    // Add .maybeSingle() if the query doesn't already have it
    const singleQuery = query.maybeSingle ? query : query.single();
    const { data, error } = await singleQuery as unknown as PostgrestResponse<T>;
    
    if (error) {
      if (allowNotFound && error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, context);
    return null; // This line is only reached if handleApiError doesn't throw
  }
}

/**
 * Utility type for filter operators
 */
export type FilterOperator = 'eq' | 'gte' | 'lte' | 'ilike';

/**
 * Apply a filter to a query based on the operator
 */
export function applyFilter<T>(
  query: any,
  column: string, 
  value: any, 
  operator: FilterOperator
): any {
  switch (operator) {
    case 'eq':
      return query.eq(column, value);
    case 'gte':
      return query.gte(column, value);
    case 'lte':
      return query.lte(column, value);
    case 'ilike':
      return query.ilike(column, `%${value}%`);
    default:
      return query;
  }
}
