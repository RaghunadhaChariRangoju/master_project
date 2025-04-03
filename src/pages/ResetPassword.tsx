import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Card, CardContent } from '@/components/ui/card';

const ResetPassword = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-agCream/50">
      <Navbar />
      
      <main className="flex-1 container max-w-screen-lg mx-auto my-10 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-agBeige shadow-md bg-white">
            <CardContent className="p-6 sm:p-8">
              <ResetPasswordForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
