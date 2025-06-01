
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for signed in user
        fetchUserProfile(session.user.id);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        // Always set loading to false, even on error
        setLoading(false);
        return;
      }
      
      console.log('User profile fetched:', data);
      setUserProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    try {
      setLoading(true);
      console.log('Attempting signup for:', email);
      
      const currentUrl = window.location.origin;
      console.log('Using redirect URL:', currentUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: currentUrl,
          data: {
            full_name: fullName,
            referred_by: referralCode || null
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setLoading(false);
        throw error;
      }

      console.log('Signup response:', data);

      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email not confirmed, setting loading to false');
        setLoading(false);
        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link. Please check your email and click the link to verify your account.",
        });
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('Email confirmed, user signed in');
        // Don't set loading to false here - let auth state change handle it
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setLoading(false);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting signin for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Signin response:', data, error);

      if (error) {
        console.error('Signin error details:', error);
        setLoading(false);
        throw error;
      }

      // Don't set loading to false here - let the auth state change handle it
      console.log('Signin successful for user:', data.user.email);
    } catch (error: any) {
      console.error('Signin error:', error);
      setLoading(false);
      
      let errorMessage = error.message;
      
      if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting signout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Signout successful');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
