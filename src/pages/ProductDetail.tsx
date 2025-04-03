import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, Heart, Plus, Minus, ZoomIn, ZoomOut, Truck, RefreshCw, BadgeCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const products = [
  {
    id: 1,
    name: 'Golden Mustard Handloom Saree',
    image: '/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png',
    price: '₹3,999',
    category: 'Sarees',
    description: 'This beautiful handloom saree features traditional motifs woven with care by skilled artisans. The golden mustard color brings warmth and elegance to any occasion.',
    material: 'Pure Cotton',
    care: 'Dry clean only'
  },
  {
    id: 2,
    name: 'Olive Green Handloom Saree',
    image: '/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png',
    price: '₹4,500',
    category: 'Sarees',
    description: 'An elegant olive green handloom saree with intricate border details. Perfect for both casual and formal occasions.',
    material: 'Cotton Blend',
    care: 'Hand wash with mild detergent'
  },
  {
    id: 3,
    name: 'Beige Floral Handloom Saree',
    image: '/lovable-uploads/5ed815a3-93ae-42af-ae00-02c01f0ca1cf.png',
    price: '₹3,750',
    category: 'Sarees',
    description: 'A delicate beige saree with beautiful floral patterns. The lightweight fabric makes it comfortable for all-day wear.',
    material: 'Cotton Silk',
    care: 'Dry clean recommended'
  },
  {
    id: 4,
    name: 'Navy Blue Ikkat Saree',
    image: '/lovable-uploads/f6b7485d-1c0a-45d7-a7a6-4fb036ee11c9.png',
    price: '₹5,500',
    category: 'Sarees',
    description: 'A stunning navy blue Ikkat saree with geometric patterns. The rich color and unique design make it a statement piece.',
    material: 'Pure Silk',
    care: 'Dry clean only'
  },
  {
    id: 5,
    name: 'Pink Handwoven Cotton Saree',
    image: '/lovable-uploads/68193f81-5551-4aa8-8dee-14a2140ca725.png',
    price: '₹3,800',
    category: 'Sarees',
    description: 'A vibrant pink handwoven cotton saree with traditional temple border. Perfect for festivals and special occasions.',
    material: 'Pure Cotton',
    care: 'Hand wash cold'
  },
  {
    id: 6,
    name: 'Checkered Pattern Handloom Saree',
    image: '/lovable-uploads/19b430ba-b151-45a0-8f5e-4261e99889f7.png',
    price: '₹4,200',
    category: 'Sarees',
    description: 'A sophisticated checkered pattern handloom saree. The unique design adds a contemporary touch to traditional attire.',
    material: 'Cotton Blend',
    care: 'Dry clean recommended'
  },
  {
    id: 7,
    name: 'Beige Lotus Motif Saree',
    image: '/lovable-uploads/eab094f1-d8f5-4749-bf8a-647599fc5e20.png',
    price: '₹4,250',
    category: 'Sarees',
    description: 'A beautiful beige saree with lotus motif throughout. The subtle elegance makes it perfect for various occasions.',
    material: 'Cotton Silk',
    care: 'Dry clean only'
  },
  {
    id: 8,
    name: 'Striped Handloom Cotton Saree',
    image: '/lovable-uploads/f2741ab4-9d00-415f-aa23-f3baed0500c1.png',
    price: '₹3,900',
    category: 'Sarees',
    description: 'A classic striped handloom cotton saree in earthy tones. The minimalist design makes it versatile for various occasions.',
    material: 'Pure Cotton',
    care: 'Hand wash with mild detergent'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id || '0');
  const product = products.find(p => p.id === productId);
  const { addToCart, toggleWishlist, isInWishlist, cartItems } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  
  const itemInCart = cartItems.find(item => item.id === productId);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} has been added to your cart.`,
      });
    }
  };
  
  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
      });
    }
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container-custom section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, the product you are looking for does not exist.</p>
          <Link to="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-agCream to-white">
      <Navbar />
      <main className="flex-grow container-custom py-10 md:py-16">
        <div className="mb-6 animate-fade-in">
          <Link to="/shop" className="inline-flex items-center gap-2 group hover:text-agTerracotta transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Shop</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-500 relative group animate-fade-in">
            <AspectRatio ratio={3/4} className="bg-transparent">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                onClick={() => setZoomOpen(true)}
              />
            </AspectRatio>
            <Button 
              variant="secondary" 
              size="icon"
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-agTerracotta hover:text-white shadow-md"
              onClick={() => setZoomOpen(true)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            {cartQuantity > 0 && (
              <div className="absolute top-4 left-4">
                <div className="bg-agTerracotta text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  {cartQuantity} in cart
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col animate-slide-up">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-agTerracotta/10 text-agTerracotta text-xs font-medium px-2.5 py-1 rounded-full">{product.category}</span>
                <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <BadgeCheck className="h-3 w-3" /> Handcrafted
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-agBrown">{product.name}</h1>
              <div className="text-2xl font-bold text-agTerracotta mb-4">{product.price}</div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-agBeige/40 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-agBrown mb-1">Material</h3>
                <p className="text-muted-foreground">{product.material}</p>
              </div>
              <div>
                <h3 className="font-medium text-agBrown mb-1">Care</h3>
                <p className="text-muted-foreground">{product.care}</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-agBrown">
                <Truck className="h-4 w-4 text-agTerracotta" />
                <span>Free shipping on orders over ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-agBrown">
                <RefreshCw className="h-4 w-4 text-agTerracotta" />
                <span>Easy 7-day returns</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="font-medium text-agBrown">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none border-r border-gray-200"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-14 text-center font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={incrementQuantity}
                  className="h-10 w-10 rounded-none border-l border-gray-200"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 mt-auto">
              <Button 
                className={cn(
                  "flex-1 gap-2 transition-all duration-300 transform hover:scale-105 bg-agTerracotta hover:bg-agBrown",
                  showAddedToCart && "bg-green-600 hover:bg-green-700"
                )}
                onClick={handleAddToCart}
                size="lg"
              >
                {showAddedToCart ? (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    Added {quantity} to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {cartQuantity > 0 ? `Add ${quantity} More to Cart` : `Add to Cart`}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "transition-all duration-300 transform hover:scale-105 h-12 w-12 border-2",
                  isWishlisted ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" : "border-agTerracotta text-agTerracotta hover:border-agBrown hover:text-agBrown"
                )}
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl p-0">
          <DialogDescription className="sr-only">Zoomed product image</DialogDescription>
          <div className="relative overflow-hidden bg-white p-4">
            <div className="overflow-auto max-h-[85vh] relative">
              <img 
                src={product?.image} 
                alt={product?.name} 
                className="w-full h-auto object-contain"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-md"
              onClick={() => setZoomOpen(false)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
