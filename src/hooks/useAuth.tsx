
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { signUpUser, signInUser, signOutUser } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, userProfile, loading, setLoading } = useAuthState();

  const isAdmin = userProfile?.role === 'admin';

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    try {
      setLoading(true);
      console.log('Starting signup process for:', email);
      
      await signUpUser(email, password, fullName, referralCode);
      console.log('Signup completed successfully');
      
    } catch (error: any) {
      console.error('Signup error in useAuth:', error);
      
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
      
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process for:', email);
      
      await signInUser(email, password);
      console.log('Signin completed successfully');
      // Loading will be set to false by the auth state change
      
    } catch (error: any) {
      console.error('Signin error in useAuth:', error);
      
      const errorMessage = error.message || 'Failed to sign in. Please try again.';
      toast({
        title: "Sign In Failed", 
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signout process');
      await signOutUser();
      console.log('Signout completed successfully');
    } catch (error: any) {
      console.error('Signout error in useAuth:', error);
      toast({
        title: "Sign Out Error",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Always provide a valid context value with proper defaults
  const contextValue: AuthContextType = {
    user: user || null,
    userProfile: userProfile || null,
    loading,
    isAdmin: isAdmin || false,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  // Return a default context if not within provider (during initialization)
  if (!context) {
    console.warn('useAuth called outside of AuthProvider, returning default values');
    return {
      user: null,
      userProfile: null,
      loading: true,
      isAdmin: false,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
    };
  }
  
  return context;
}
