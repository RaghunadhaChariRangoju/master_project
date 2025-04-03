export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount: number;
  coupon_code?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id?: string;
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
  expected_delivery_date?: string;
  tracking_number?: string;
  tracking_url?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned'
  | 'refunded';

export type PaymentMethod = 
  | 'card' 
  | 'upi' 
  | 'netbanking' 
  | 'wallet' 
  | 'cod' 
  | 'other';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export interface ShippingAddress {
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email?: string;
}

export interface BillingAddress extends ShippingAddress {
  company_name?: string;
  gstin?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  price: number;
  total: number;
  sku: string;
  attributes?: Record<string, string>;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items_count: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  message: string;
  created_at: string;
  created_by: string;
}
