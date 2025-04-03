import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Heart, 
  ShoppingCart, 
  Share2,
  Truck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from './ProductImage';
import { useProductActions } from '@/hooks/useProductActions';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { 
    addItemToCart, 
    toggleWishlistItem, 
    isItemInWishlist, 
    goBack,
    isLoading 
  } = useProductActions();
  
  // Helper function to set quantity
  const updateQuantity = (newQuantity: number) => {
    // Ensure quantity is at least 1 and not more than available stock
    const validQuantity = Math.max(1, Math.min(newQuantity, product.stock_quantity));
    setQuantity(validQuantity);
  };
  
  // Handle adding to cart
  const handleAddToCart = () => {
    addItemToCart(product, quantity);
  };
  
  // Handle toggling wishlist
  const handleToggleWishlist = () => {
    toggleWishlistItem(product);
  };
  
  // Format product description with line breaks
  const formattedDescription = product.description.split('\\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < product.description.split('\\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={goBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative h-[400px] mb-4 bg-muted rounded-lg overflow-hidden">
            <ProductImage
              images={product.images}
              alt={product.name}
              className="w-full h-full object-contain"
              index={activeImageIndex}
            />
          </div>
          
          {/* Thumbnail images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`
                    relative h-16 w-16 cursor-pointer rounded-md overflow-hidden 
                    ${activeImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70'}
                  `}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <ProductImage
                    images={[image]}
                    alt={`${product.name} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and badges */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                className={isItemInWishlist(product.id) ? 'text-red-500' : ''}
                onClick={handleToggleWishlist}
                disabled={isLoading}
              >
                <Heart className="h-5 w-5" fill={isItemInWishlist(product.id) ? "currentColor" : "none"} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.stock_quantity > 0 ? (
                <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
          
          {/* Price and quantity */}
          <div>
            <span className="text-3xl font-semibold">{formatCurrency(product.price)}</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1 || isLoading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-14 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={quantity >= product.stock_quantity || isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock_quantity} available
              </span>
            </div>
          </div>
          
          {/* Add to cart button */}
          <Button 
            className="w-full h-12 text-base"
            onClick={handleAddToCart}
            disabled={isLoading || product.stock_quantity === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          
          {/* Share button */}
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Product
          </Button>
          
          {/* Shipping info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Delivery within 5-7 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product details tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="p-4 bg-muted/20 rounded-md min-h-[200px]">
          {formattedDescription}
        </TabsContent>
        
        <TabsContent value="specifications" className="p-4 bg-muted/20 rounded-md min-h-[200px]">
          <div className="space-y-3">
            <div className="grid grid-cols-3 pb-2 border-b">
              <div className="font-medium">Category</div>
              <div className="col-span-2">{product.category}</div>
            </div>
            <div className="grid grid-cols-3 pb-2 border-b">
              <div className="font-medium">Material</div>
              <div className="col-span-2">Handloom Cotton</div>
            </div>
            <div className="grid grid-cols-3 pb-2 border-b">
              <div className="font-medium">Weight</div>
              <div className="col-span-2">Varies by product</div>
            </div>
            <div className="grid grid-cols-3 pb-2 border-b">
              <div className="font-medium">Dimensions</div>
              <div className="col-span-2">Standard</div>
            </div>
            <div className="grid grid-cols-3 pb-2 border-b">
              <div className="font-medium">Origin</div>
              <div className="col-span-2">India</div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shipping" className="p-4 bg-muted/20 rounded-md min-h-[200px]">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-lg mb-2">Shipping Policy</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Free standard shipping on all orders within India</li>
                <li>Express shipping available at an additional cost</li>
                <li>International shipping available to select countries</li>
                <li>Most orders ship within 1-2 business days</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-2">Return Policy</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Returns accepted within 14 days of delivery</li>
                <li>Items must be unused and in original packaging</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Refunds will be processed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                variant="compact"
                showCategory={false}
                showWishlist={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
