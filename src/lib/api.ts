import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';

interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  in_stock?: boolean;
  colors?: string[];
  materials?: string[];
  sort?: 'newest' | 'price-low-high' | 'price-high-low' | 'popularity';
}

// Product API functions
export const productApi = {
  // Get products with filters
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*');

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Apply price range filters
    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    // Apply sale filter
    if (filters.on_sale) {
      query = query.not('discount_price', 'is', null);
    }

    // Apply in-stock filter
    if (filters.in_stock) {
      query = query.gt('stock', 0);
    }

    // Apply colors filter
    if (filters.colors && filters.colors.length > 0) {
      // For simplicity, assuming colors are stored as an array in Supabase
      query = query.contains('colors', filters.colors);
    }

    // Apply materials filter
    if (filters.materials && filters.materials.length > 0) {
      // For simplicity, assuming materials are stored as an array in Supabase
      query = query.contains('materials', filters.materials);
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-low-high':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high-low':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('views', { ascending: false });
          break;
      }
    } else {
      // Default sorting by newest
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data as unknown as Product[];
  },

  // Get a single product by ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as unknown as Product;
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data as unknown as Product[];
  },

  // Get related products
  async getRelatedProducts(productId: string, category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .limit(4);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    return data as unknown as Product[];
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data as unknown as Product[];
  },

  // Get products on sale
  async getProductsOnSale(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('discount_price', 'is', null)
      .limit(8);

    if (error) {
      console.error('Error fetching products on sale:', error);
      return [];
    }

    return data as unknown as Product[];
  },

  // Track product view
  async trackProductView(productId: string): Promise<void> {
    const { error } = await supabase
      .rpc('increment_product_views', { product_id: productId });

    if (error) {
      console.error('Error tracking product view:', error);
    }
  },
};

// Order API functions
export const orderApi = {
  // Create a new order
  async createOrder(orderData: any): Promise<string | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data.id;
  },

  // Get user orders
  async getUserOrders(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return data;
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  },
};

// User API functions
export const userApi = {
  // Get user profile
  async getUserProfile(userId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: any): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  },
};
