
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

type WishlistDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const WishlistDrawer = ({ open, onOpenChange }: WishlistDrawerProps) => {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Wishlist ({wishlistItems.length})</SheetTitle>
        </SheetHeader>
        
        {wishlistItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
            <p className="text-muted-foreground mb-6">Your wishlist is empty</p>
            <Link to="/shop">
              <Button className="btn-secondary">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="flex-grow overflow-auto pt-4">
            <ul className="space-y-4">
              {wishlistItems.map((item) => (
                <li key={item.id} className="border rounded-md p-4 relative">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-16 w-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm font-bold text-agBrown">{item.price}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8 text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => toggleWishlist(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
