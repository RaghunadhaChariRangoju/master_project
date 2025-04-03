import { useCallback } from 'react';
import { Product } from '@/types/supabase';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

/**
 * A custom hook that encapsulates common product-related actions
 * to avoid code duplication across product components
 */
export function useProductActions() {
  const { addToCart, toggleWishlist, isInWishlist, isLoading } = useCart();
  const navigate = useNavigate();
  
  // Navigate to product details
  const goToProductDetails = useCallback((productId: string | number) => {
    navigate(`/products/${String(productId)}`);
  }, [navigate]);
  
  // Add item to cart
  const addItemToCart = useCallback((product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
  }, [addToCart]);
  
  // Toggle wishlist item
  const toggleWishlistItem = useCallback((product: Product) => {
    toggleWishlist(product);
  }, [toggleWishlist]);
  
  // Check if item is in wishlist
  const isItemInWishlist = useCallback((productId: string | number) => {
    return isInWishlist(String(productId));
  }, [isInWishlist]);
  
  // Navigate back
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  return {
    goToProductDetails,
    addItemToCart,
    toggleWishlistItem,
    isItemInWishlist,
    goBack,
    isLoading
  };
}
