
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Truck } from 'lucide-react';

// Mock cart items from CartDrawer
const CART_ITEMS = [
  { id: 1, name: 'Cotton Saree', price: 2500, quantity: 1, image: '/placeholder.svg' },
  { id: 2, name: 'Handloom Scarf', price: 800, quantity: 2, image: '/placeholder.svg' },
];

// Separate validation schemas for shipping and payment
const shippingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  pincode: z.string().min(6, { message: "Valid pincode is required." }),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, { message: "Card number should be 16 digits." }),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry should be in MM/YY format." }),
  cardCVC: z.string().min(3, { message: "CVC should be at least 3 digits." }),
});

// Combined schema for the entire checkout process
const checkoutSchema = z.object({
  ...shippingSchema.shape,
  ...paymentSchema.shape,
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [paymentStep, setPaymentStep] = useState<'shipping' | 'payment'>('shipping');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const cartTotal = CART_ITEMS.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 150;
  const totalAmount = cartTotal + shippingCost;
  
  // Initialize the form with the complete schema but we'll validate based on step
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(paymentStep === 'shipping' ? shippingSchema : checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    },
    mode: 'onSubmit',
  });
  
  const continueToPayment = async () => {
    // Validate just the shipping fields
    const shippingValid = await form.trigger(['name', 'email', 'address', 'city', 'state', 'pincode']);
    
    if (shippingValid) {
      setPaymentStep('payment');
      console.log("Continuing to payment step");
    } else {
      console.log("Shipping validation failed");
    }
  };
  
  const onSubmit = (data: CheckoutFormValues) => {
    if (paymentStep === 'shipping') {
      continueToPayment();
      return;
    }
    
    // Only reaches here when in payment step and form is valid
    toast({
      title: "Order placed successfully!",
      description: "Your order has been placed and will be shipped soon.",
    });
    
    console.log("Order placed successfully", data);
    
    // In a real app, we would process the payment and create the order here
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container-custom py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {paymentStep === 'shipping' ? (
                    <>
                      <h2 className="text-xl font-semibold flex items-center mb-4">
                        <Truck className="mr-2 h-5 w-5" /> Shipping Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input placeholder="Pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold flex items-center mb-4">
                        <CreditCard className="mr-2 h-5 w-5" /> Payment Information
                      </h2>
                      
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardCVC"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4 flex justify-between">
                    {paymentStep === 'payment' && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setPaymentStep('shipping')}
                      >
                        Back to Shipping
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      className="ml-auto"
                    >
                      {paymentStep === 'shipping' ? 'Continue to Payment' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="divide-y">
                {CART_ITEMS.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3">
                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{shippingCost.toLocaleString()}</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
