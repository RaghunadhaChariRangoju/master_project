import { Product } from './product';

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  variant_id?: string;
  variant_name?: string;
  attributes?: Record<string, string>;
  price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  tax: number;
  shipping_fee: number;
  discount: number;
  coupon_code?: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  added_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_value?: number;
  maximum_discount?: number;
  start_date: string;
  expiry_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
  products?: string[];
  categories?: string[];
  users?: string[];
}
