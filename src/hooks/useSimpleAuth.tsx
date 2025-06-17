
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Strict admin check - only clarcatalyst123@gmail.com is admin
  const isAdmin = user?.email === 'clarcatalyst123@gmail.com';

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('Initial session user:', session?.user?.email || 'No user');
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth event:', event, 'User:', session?.user?.email || 'No user');
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.clear();
          sessionStorage.clear();
        } else {
          setUser(session?.user || null);
          
          // Log admin status for debugging
          if (session?.user?.email === 'clarcatalyst123@gmail.com') {
            console.log('Admin user detected:', session.user.email);
          }
        }
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in user:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check if this is the admin user
      if (email.trim().toLowerCase() === 'clarcatalyst123@gmail.com') {
        console.log('Admin user signed in successfully');
        toast({
          title: "Admin Access Granted",
          description: "Welcome back, Administrator!",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            referred_by: referralCode || null
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Registration Successful!",
        description: "Please check your email and click the verification link.",
        duration: 8000,
      });
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      await supabase.auth.signOut();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out",
      });
    }
  };

  // Debug logging for admin status
  useEffect(() => {
    if (user) {
      console.log('Current user:', user.email, 'Is Admin:', isAdmin);
    }
  }, [user, isAdmin]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
