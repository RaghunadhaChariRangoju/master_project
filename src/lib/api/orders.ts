import { supabase } from './client';
import { Order, OrderItem } from '@/types/supabase';
import { handleApiError } from './utils';

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  price: number;
}

export interface OrderInput {
  user_id: string;
  total_amount: number;
  shipping_address: string;
  status?: string;
  items: OrderItemInput[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * Create a new order and its items in a single transaction
 */
export async function createOrder(input: OrderInput): Promise<Order> {
  try {
    // Start a Supabase transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: input.user_id,
        total_amount: input.total_amount,
        shipping_address: input.shipping_address,
        status: input.status || 'pending'
      })
      .select()
      .single();
    
    if (orderError) {
      throw orderError;
    }
    
    // Create order items with the order_id
    const orderItems = input.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      // Attempt to clean up the order if item insertion fails
      // This isn't a true transaction (Supabase doesn't support real transactions yet)
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }
    
    return order;
  } catch (error) {
    handleApiError(error, 'createOrder');
  }
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    handleApiError(error, `getUserOrders(${userId})`);
  }
}

/**
 * Get a single order with its items
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, `getOrderById(${orderId})`);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, `updateOrderStatus(${orderId}, ${status})`);
  }
}

export const orderApi = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
