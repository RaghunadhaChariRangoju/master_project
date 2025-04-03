import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

// Define record type for params
type Params = Record<string, string | undefined>;

export function OrderDetailPage() {
  const params = useParams<Params>();
  const id = params.id;
  const navigate = useNavigate();

  // In a real implementation, we would fetch order details here
  // For now, we'll just show a placeholder to resolve TypeScript errors
  
  return (
    <div className="container py-12">
      <SEO 
        title={`Order #${id || ''} | AG Handloom`}
        description="View your order details and status"
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{id}</CardTitle>
              <CardDescription>
                Order details and tracking information
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Processing</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-muted-foreground">
                Address information will be displayed here
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p className="text-sm text-muted-foreground">
                Payment details will be displayed here
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="flex gap-4 py-4 border-b">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Sample Product</h4>
                    <p className="text-sm text-muted-foreground">
                      Qty: 1 × ₹1,999.00
                    </p>
                  </div>
                  <p className="font-medium">₹1,999.00</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>₹1,999.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p>₹0.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Tax</p>
              <p>₹199.90</p>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>₹2,198.90</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
