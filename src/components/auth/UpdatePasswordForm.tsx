import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { updatePasswordSchema, UpdatePasswordFormValues } from '@/lib/validation';

export function UpdatePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasResetToken, setHasResetToken] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if the URL contains a recovery token
  useEffect(() => {
    const checkForRecoveryToken = async () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.replace('#', ''));
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');
      
      if (accessToken && type === 'recovery') {
        // Set the session from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        
        if (error) {
          setError('Invalid or expired reset link. Please request a new one.');
          return;
        }
        
        setHasResetToken(true);
      } else {
        setError('No valid reset link detected. Please request a password reset from the login page.');
      }
    };
    
    checkForRecoveryToken();
  }, []);

  async function onSubmit(data: UpdatePasswordFormValues) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      form.reset();
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
        <p className="text-muted-foreground">
          Enter and confirm your new password below.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <AlertDescription>
                Your password has been updated successfully. Redirecting you to the login page...
              </AlertDescription>
            </Alert>
          )}
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...field} 
                      disabled={isSubmitting || success || !hasResetToken}
                      autoComplete="new-password"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...field} 
                      disabled={isSubmitting || success || !hasResetToken}
                      autoComplete="new-password"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-agIndigo hover:bg-agIndigo/90"
            disabled={isSubmitting || success || !hasResetToken}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-agIndigo"
              onClick={() => navigate('/auth')}
              disabled={isSubmitting}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
