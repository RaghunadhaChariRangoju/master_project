
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] sm:h-[70vh] rounded-t-xl">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" /> 
            Your Cart 
            {cartCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-agGold text-white">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </DrawerTitle>
        </DrawerHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-[50vh]">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex items-start space-x-4">
                  <Link to={`/product/${item.id}`} onClick={() => onOpenChange(false)} className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} onClick={() => onOpenChange(false)}>
                      <h4 className="text-base font-medium hover:text-agTerracotta transition-colors">{item.name}</h4>
                    </Link>
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 p-0 rounded-l-md rounded-r-none border-r-0" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="h-7 min-w-[2.5rem] flex items-center justify-center border-y border-input bg-background px-2 text-sm font-medium">
                        {item.quantity}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7 p-0 rounded-r-md rounded-l-none border-l-0" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium">₹{item.price.toLocaleString()} × {item.quantity}</p>
                      <p className="font-semibold text-agTerracotta">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {cartItems.length > 0 && (
          <DrawerFooter className="border-t">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <Button className="w-full mt-4" asChild onClick={() => onOpenChange(false)}>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild onClick={() => onOpenChange(false)}>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
