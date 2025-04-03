import React, { useState, useEffect } from 'react';
import { productApi } from '@/lib/api';
import { Product } from '@/types/supabase';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductFilter } from '@/lib/api/products';

interface ProductListProps {
  initialCategory?: string;
  initialSearch?: string;
  initialSortBy?: 'price' | 'name' | 'created_at';
  initialSortOrder?: 'asc' | 'desc';
}

export function ProductList({ 
  initialCategory, 
  initialSearch,
  initialSortBy = 'name',
  initialSortOrder = 'asc'
}: ProductListProps) {
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState<ProductFilter>({
    category: initialCategory,
    search: initialSearch,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder
  });
  
  // Categories state
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await productApi.getProductCategories();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to load categories'));
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productApi.getProducts(filters);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err instanceof Error ? err : new Error('Failed to load products'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    // Special case for category - set to undefined when "all" is selected
    if (key === 'category' && value === 'all') {
      value = undefined;
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle search
  const handleSearch = () => {
    fetchProducts();
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      sortBy: 'name',
      sortOrder: 'asc'
    });
    
    // We wait for state update to complete before fetching
    setTimeout(() => {
      fetchProducts();
    }, 0);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Handloom Products</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => handleFilterChange('category', value)}
              disabled={isLoadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <Select 
              value={`${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as [
                  'price' | 'name' | 'created_at', 
                  'asc' | 'desc'
                ];
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" /> Apply
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          Error loading products: {error.message}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No results */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <p className="text-lg text-gray-500">No products found. Try changing your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleResetFilters}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      )}
      
      {/* Product grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              showCategory={true}
              showAddToCart={true}
              showWishlist={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
