import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";
import FloatingBanner from "./components/FloatingBanner";
import { ProfilePage } from "./components/profile/ProfilePage";
import { OrdersPage } from "./components/orders/OrdersPage";
import { OrderDetailPage } from "./components/orders/OrderDetailPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SEO from "./components/SEO";
// Import using index files
import { Dashboard } from "./pages/admin";
import { PaymentSuccess, PaymentCancel } from "./pages/payment";
import { ErrorBoundary } from "./components/ui/error-boundary";

// Create loading fallback
const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Configure query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Add default SEO settings */}
          <SEO />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/update-password" element={<UpdatePassword />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Protected Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/orders/:id" element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  
                  {/* Payment Routes - order matters here to avoid type errors */}
                  <Route path="/payment/success/:orderId" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PaymentSuccess />
                    </Suspense>
                  } />
                  
                  <Route path="/payment/success" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PaymentSuccess />
                    </Suspense>
                  } />
                  
                  <Route path="/payment/cancel" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PaymentCancel />
                    </Suspense>
                  } />
                  
                  <Route path="/payment/cancel/:orderId" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PaymentCancel />
                    </Suspense>
                  } />
                  
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingBanner />
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
