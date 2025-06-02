
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
      await signUpUser(email, password, fullName, referralCode);
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
      await signInUser(email, password);
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (error: any) {
      console.error('Signout error:', error);
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
