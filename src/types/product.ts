export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  features?: string[];
  price: number;
  discount_price?: number | null;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  tags?: string[];
  colors?: string[];
  materials?: string[];
  sizes?: string[];
  stock: number;
  sku: string;
  is_featured: boolean;
  rating?: number;
  review_count?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shipping_time?: string;
  care_instructions?: string[];
  created_at: string;
  updated_at: string;
  views?: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  review: string;
  title?: string;
  images?: string[];
  created_at: string;
  helpful_count?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  discount_price?: number | null;
  attributes: Record<string, any>;
  stock: number;
  images?: string[];
}

export interface ProductFilter {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  colors?: string[];
  materials?: string[];
  sizes?: string[];
  sort?: 'newest' | 'price-low-high' | 'price-high-low' | 'popularity';
  in_stock?: boolean;
  on_sale?: boolean;
  page?: number;
  limit?: number;
}
