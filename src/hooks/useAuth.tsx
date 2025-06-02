
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { signUpUser, signInUser, signOutUser } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, userProfile, loading, setLoading } = useAuthState();

  const isAdmin = userProfile?.role === 'admin';

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    try {
      setLoading(true);
      console.log('Starting signup process for:', email);
      await signUpUser(email, password, fullName, referralCode);
      console.log('Signup completed successfully');
      toast({
        title: "Account Created!",
        description: "Welcome to the platform. You can now sign in.",
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Signup error in useAuth:', error);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting signin process for:', email);
      await signInUser(email, password);
      console.log('Signin completed successfully');
      // Loading will be set to false by the auth state change
    } catch (error: any) {
      console.error('Signin error in useAuth:', error);
      setLoading(false);
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
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
