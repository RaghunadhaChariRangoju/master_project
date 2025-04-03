import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import SEO from '@/components/SEO';

// Define record type for params
type Params = Record<string, string | undefined>;

export default function PaymentCancel() {
  const params = useParams<Params>();
  const orderId = params.orderId;
  const navigate = useNavigate();

  return (
    <div className="container max-w-md mx-auto py-16">
      <SEO 
        title="Payment Cancelled | AG Handloom"
        description="Your payment was not completed. No worries, you can try again!"
        noIndex={true}
      />
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was not completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Don't worry! Your payment was cancelled and no money was charged.
            You can try again or choose a different payment method.
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
            onClick={() => navigate('/checkout')}
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/cart')}
          >
            Return to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
