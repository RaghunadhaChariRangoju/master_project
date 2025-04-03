import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Session, 
  User as SupabaseUser, 
  UserMetadata,
} from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Enhanced User type that includes Supabase user and our additional properties
interface User {
  id: string;
  email: string | undefined;
  name: string | undefined;
  role: string | undefined;
  avatar_url?: string | null;
}

// Create a context for authentication
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility to format Supabase user into our User type
const formatUser = (user: SupabaseUser): User => {
  const metadata = user.user_metadata as UserMetadata & {
    name?: string;
    role?: string;
  };
  
  return {
    id: user.id,
    email: user.email,
    name: metadata?.name || user.email?.split('@')[0] || 'User',
    role: metadata?.role || 'user',
    avatar_url: metadata?.avatar_url || null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Helper function to ensure a user profile exists
  const ensureUserProfile = async (user: SupabaseUser) => {
    try {
      // First check if profile exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      // Update user with profile data if exists
      if (profileData) {
        setUser(prev => prev ? {
          ...prev,
          name: profileData.name || prev.name,
          role: profileData.role || prev.role,
        } : null);
        return profileData;
      } else {
        // Create profile if it doesn't exist
        const metadata = user.user_metadata as UserMetadata & {
          name?: string;
          role?: string;
        };
        const name = metadata?.name || user.email?.split('@')[0] || '';
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name,
            email: user.email,
            role: metadata?.role || 'user',
          })
          .select()
          .single();
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          return null;
        }
        
        return newProfile;
      }
    } catch (error) {
      console.error('Profile handling error:', error);
      return null;
    }
  };

  // Initialize auth state from Supabase session
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? formatUser(session.user) : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session ? formatUser(session.user) : null);
        setLoading(false);
        
        // Fetch user profile if logged in
        if (session?.user) {
          try {
            await ensureUserProfile(session.user);
          } catch (error) {
            console.error('Error handling user profile:', error);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: `Welcome back${data.user.user_metadata?.name ? ', ' + data.user.user_metadata.name : ''}!`,
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user',
          },
        },
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during registration",
          variant: "destructive",
        });
        return false;
      }
      
      if (data.user) {
        // Profile will be created by the auth state change listener
        toast({
          title: "Registration successful",
          description: `Welcome, ${name}!`,
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase with specific options to clear storage
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This ensures all devices/tabs are signed out
      });
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      // Manually clear any localStorage items Supabase might have created
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      
      // Clear all cookies as well
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force refresh to homepage after logout
      navigate('/', { replace: true });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
