import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle } from 'lucide-react';
import SEO from '@/components/SEO';

// Define record type for params to solve TypeScript errors
type Params = Record<string, string | undefined>;

export default function PaymentSuccess() {
  // Use Record<string, string | undefined> type for params to match React Router's type expectations
  const params = useParams<Params>();
  const orderId = params.orderId;
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
    
    // Show success toast
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
    });
  }, [clearCart, toast]);

  return (
    <div className="container max-w-md mx-auto py-16">
      <SEO 
        title="Payment Successful | AG Handloom"
        description="Your payment has been processed successfully. Thank you for your purchase!"
        noIndex={true}
      />
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your order has been processed successfully. 
            We've sent a confirmation email with your order details.
          </p>
          
          {orderId && (
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Order Reference:</p>
              <p className="font-mono text-lg">{orderId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={() => navigate(orderId ? `/orders/${orderId}` : '/orders')}
          >
            View Order Details
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
