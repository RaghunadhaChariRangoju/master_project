import React from 'react';
import { Product } from '@/types/supabase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from './ProductImage';
import { useProductActions } from '@/hooks/useProductActions';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  variant?: 'default' | 'compact';
}

export function ProductCard({ 
  product, 
  showCategory = true, 
  showAddToCart = true,
  showWishlist = true,
  variant = 'default'
}: ProductCardProps) {
  const { 
    goToProductDetails, 
    addItemToCart, 
    toggleWishlistItem, 
    isItemInWishlist,
    isLoading 
  } = useProductActions();

  const handleViewDetails = () => {
    goToProductDetails(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlistItem(product);
  };

  // Determine if this is a compact card variant
  const isCompact = variant === 'compact';
  
  return (
    <Card 
      className={`h-full flex flex-col group overflow-hidden hover:shadow-md transition-shadow
        ${isCompact ? 'border-0 shadow-none' : ''}`}
      onClick={handleViewDetails}
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductImage 
          images={product.images}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Quick action buttons */}
        {showWishlist && (
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={`h-8 w-8 rounded-full opacity-90 ${isItemInWishlist(product.id) ? 'text-red-500' : ''}`}
              onClick={handleToggleWishlist}
              disabled={isLoading}
            >
              <Heart className="h-4 w-4" fill={isItemInWishlist(product.id) ? "currentColor" : "none"} />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className={`${isCompact ? 'p-2' : 'pb-2 pt-3 px-3'}`}>
        <div className="flex flex-col">
          <CardTitle className={`${isCompact ? 'text-sm' : 'text-base'} line-clamp-1`}>
            {product.name}
          </CardTitle>
          {showCategory && (
            <Badge variant="outline" className="self-start mt-1 text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      {!isCompact && (
        <CardContent className="px-3 pb-3 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">{formatCurrency(product.price)}</span>
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <span className="text-xs text-orange-500">
                Only {product.stock_quantity} left
              </span>
            )}
            {product.stock_quantity === 0 && (
              <span className="text-xs text-red-500">
                Out of stock
              </span>
            )}
          </div>
        </CardContent>
      )}

      {isCompact ? (
        <CardFooter className="p-2 pt-0 flex-col items-start gap-1">
          <span className="font-medium">{formatCurrency(product.price)}</span>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full mt-1"
            onClick={handleViewDetails}
          >
            View
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="px-3 pt-0 pb-3 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4 mr-1" /> Details
          </Button>
          
          {showAddToCart && (
            <Button 
              size="sm" 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isLoading}
            >
              <ShoppingBag className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
