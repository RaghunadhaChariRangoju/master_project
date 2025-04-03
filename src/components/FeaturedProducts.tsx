
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, ArrowRight, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

type Product = {
  id: number;
  name: string;
  image: string;
  price: string;
  category: string;
  isNew?: boolean;
  discount?: string;
  rating?: number;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Golden Mustard Handloom Saree',
    image: '/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png',
    price: '₹3,999',
    category: 'Sarees',
    isNew: true,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Olive Green Handloom Saree',
    image: '/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png',
    price: '₹4,500',
    category: 'Sarees',
    discount: '10% OFF',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Beige Floral Handloom Saree',
    image: '/lovable-uploads/5ed815a3-93ae-42af-ae00-02c01f0ca1cf.png',
    price: '₹3,750',
    category: 'Sarees',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Navy Blue Ikkat Saree',
    image: '/lovable-uploads/f6b7485d-1c0a-45d7-a7a6-4fb036ee11c9.png',
    price: '₹5,500',
    category: 'Sarees',
    isNew: true,
    rating: 5.0,
  },
];

const FeaturedProducts = () => {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const { toast } = useToast();
  
  return (
    <section className="section-padding bg-gradient-to-b from-agCream to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 w-40 h-40 rounded-full bg-agIndigo/5 blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-40 h-40 rounded-full bg-agTerracotta/5 blur-3xl"></div>
      
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-agGold/20 text-agBrown text-sm font-medium mb-4">Handcrafted Selection</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover our most loved handloom treasures, each piece lovingly crafted by skilled artisans</p>
        </motion.div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((product, index) => {
              const wishlisted = isInWishlist(product.id);
              
              return (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="product-card group h-full border border-slate-100 hover:border-agGold/50 transition-all duration-300">
                      <div className="relative h-80 overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Category badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-agIndigo text-white font-medium">
                            {product.category}
                          </Badge>
                        </div>
                        
                        {/* New or discount badge */}
                        {(product.isNew || product.discount) && (
                          <div className="absolute top-3 left-3">
                            {product.isNew && (
                              <Badge className="bg-agTerracotta text-white font-medium">
                                New Arrival
                              </Badge>
                            )}
                            {product.discount && (
                              <Badge className="bg-agGold text-white font-medium">
                                {product.discount}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Wishlist button - Fixed to ensure click works */}
                        <Button
                          variant="outline"
                          size="icon"
                          className={cn(
                            "absolute top-16 right-3 bg-white/80 hover:bg-white transition-all duration-300 z-20",
                            wishlisted ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" : ""
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                            toast({
                              title: wishlisted ? "Removed from wishlist" : "Added to wishlist",
                              description: `${product.name} has been ${wishlisted ? "removed from" : "added to"} your wishlist.`,
                            });
                          }}
                          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart className={cn("h-4 w-4", wishlisted ? "fill-current" : "")} />
                        </Button>
                        
                        {/* Overlay buttons for quick actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="bg-white text-agIndigo hover:bg-agGold hover:text-white hover:border-agGold transition-all duration-300 z-20"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, 1);
                              toast({
                                title: "Added to cart",
                                description: `${product.name} has been added to your cart.`,
                              });
                            }}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          
                          <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="bg-white text-agIndigo hover:bg-agIndigo hover:text-white hover:border-agIndigo transition-all duration-300 z-20"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Quick View
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <CardContent className="p-5">
                        <Link to={`/product/${product.id}`} className="block group">
                          <h3 className="text-lg font-medium mb-2 group-hover:text-agTerracotta transition-colors duration-300">{product.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-agBrown">{product.price}</span>
                            {product.rating && (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-agGold fill-agGold mr-1" />
                                <span className="text-sm text-muted-foreground">{product.rating}</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 bg-white/80 hover:bg-white border-agTerracotta text-agTerracotta hover:text-agBrown" />
            <CarouselNext className="right-0 bg-white/80 hover:bg-white border-agTerracotta text-agTerracotta hover:text-agBrown" />
          </div>
        </Carousel>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/shop">
            <Button className="bg-agIndigo hover:bg-agBrown text-white transition-all duration-300 px-8 py-6 rounded-md text-base group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
