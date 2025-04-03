import { supabase } from './client';
import { Product } from '@/types/supabase';
import { handleResult, withErrorHandling } from './utils';

export interface ProductFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Get products with filtering, sorting and pagination
 */
export async function getProductsBase(filters: ProductFilter = {}): Promise<Product[]> {
  let query = supabase.from('products').select('*');

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  
  // Apply sorting
  const sortBy = filters.sortBy || 'name';
  const sortOrder = filters.sortOrder || 'asc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  
  // Apply pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  const result = await query;
  return handleResult(result, 'getProducts') || [];
}

/**
 * Get a single product by ID
 */
export async function getProductByIdBase(id: string): Promise<Product | null> {
  const result = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  // maybeSingle returns null if no rows match, so we don't need to handle this as an error
  if (result.error) {
    return handleResult(result, `getProductById(${id})`);
  }
  
  return result.data;
}

/**
 * Get unique product categories
 */
export async function getProductCategoriesBase(): Promise<string[]> {
  const result = await supabase
    .from('products')
    .select('category')
    .order('category');
  
  const data = handleResult(result, 'getProductCategories');
  
  // Extract unique categories
  const categories = [...new Set(data.map(item => item.category))];
  return categories;
}

// Wrap all base functions with error handling
export const getProducts = withErrorHandling(getProductsBase, 'getProducts');
export const getProductById = withErrorHandling(getProductByIdBase, 'getProductById');
export const getProductCategories = withErrorHandling(getProductCategoriesBase, 'getProductCategories');

export const productApi = {
  getProducts,
  getProductById,
  getProductCategories
};
