import { supabase } from './client';
import { WishlistItem } from '@/types/cart';
import { Product } from '@/types/product';

export const wishlistApi = {
  // Get user's wishlist
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        user_id,
        product_id,
        added_at,
        products:product_id (*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    // Format data to match our WishlistItem type
    return data.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      product: item.products as unknown as Product,
      added_at: item.added_at,
    }));
  },

  // Add item to wishlist
  async addToWishlist(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) {
      return false;
    }

    // Check if item already exists in wishlist
    const { data: existingItems } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    // If item already exists, return true (no need to add again)
    if (existingItems) {
      return true;
    }

    // Add to wishlist
    const { error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: productId,
        added_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  },

  // Remove item from wishlist
  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  },

  // Check if product is in wishlist
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) {
      return false;
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  },

  // Clear wishlist
  async clearWishlist(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }

    return true;
  },
};
