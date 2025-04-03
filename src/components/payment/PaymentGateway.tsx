import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Clock, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Define interface for payment methods
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// Define props interface
interface PaymentGatewayProps {
  orderId: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onPaymentComplete: (paymentId: string) => void;
  onPaymentCancel: () => void;
}

export function PaymentGateway({
  orderId,
  amount,
  currency = 'INR',
  customerName,
  customerEmail,
  customerPhone,
  onPaymentComplete,
  onPaymentCancel,
}: PaymentGatewayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Define available payment methods
    const methods: PaymentMethod[] = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your card',
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Pay using UPI apps like Google Pay, PhonePe, etc.',
        icon: <Wallet className="h-5 w-5" />,
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive the product',
        icon: <Clock className="h-5 w-5" />,
      },
    ];

    setPaymentMethods(methods);
  }, []);

  // Function to initialize and open Razorpay
  const initializeRazorpay = async () => {
    if (!window.Razorpay) {
      // Load Razorpay script if not already loaded
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }
    return Promise.resolve();
  };

  // Handle payment processing
  const processPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue with payment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (selectedMethod === 'cod') {
        // For Cash on Delivery, simply complete the order without payment gateway
        setTimeout(() => {
          onPaymentComplete('cod_' + Date.now());
          toast({
            title: "Order Placed",
            description: "Your Cash on Delivery order has been placed successfully",
          });
        }, 1500);
        return;
      }

      // Initialize Razorpay
      await initializeRazorpay();

      // In a real application, you would make an API call to your backend
      // to create a Razorpay order and get the order_id
      // Here we're simulating that with a static implementation

      // For demo purposes - in production this should come from your server
      const razorpayOrderId = 'order_' + Date.now();
      
      // Configure Razorpay options
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your actual Razorpay key
        amount: amount * 100, // Razorpay amount is in paisa
        currency,
        name: 'AG Handloom',
        description: 'Payment for Order #' + orderId.slice(0, 8),
        order_id: razorpayOrderId,
        handler: function (response: any) {
          // Payment successful
          const paymentId = response.razorpay_payment_id;
          onPaymentComplete(paymentId);
          
          toast({
            title: "Payment Successful",
            description: "Your payment has been processed successfully",
          });
          
          // Navigate to success page
          navigate(`/payment/success?order_id=${orderId}`);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          order_id: orderId,
        },
        theme: {
          color: '#6E0F8B', // Primary color of the website
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            onPaymentCancel();
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled. You can try again.",
            });
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>
          Choose your preferred payment method to complete your order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={setSelectedMethod}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-input hover:border-primary/50'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-primary">{method.icon}</div>
                  <div>
                    <Label htmlFor={method.id} className="text-base font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 space-y-4">
          <h3 className="font-medium">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span>{orderId.slice(0, 8)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-medium">
            <span>Total Amount</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          className="w-full" 
          size="lg"
          onClick={processPayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </Button>
        <Button 
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={onPaymentCancel}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
