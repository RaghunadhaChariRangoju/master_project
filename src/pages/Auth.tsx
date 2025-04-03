
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Don't render anything while checking authentication
  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-agCream to-agIndigo/20 relative">
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <h1 className="text-4xl font-bold text-agBrown mb-6">AG Handlooms</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Join our community of handloom enthusiasts and discover the beauty of authentic, handcrafted textiles.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col p-4 sm:p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
          className="w-full max-w-md mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
