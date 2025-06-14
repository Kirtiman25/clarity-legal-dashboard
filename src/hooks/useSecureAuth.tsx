
import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useSecureAuth() {
  const { signUp: originalSignUp, signIn: originalSignIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await originalSignUp(email, password, fullName, referralCode);
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || 'Failed to create account',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSubmitting) return;

    // Basic validation only
    if (!email?.trim() || !password) {
      const error = new Error('Email and password are required');
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    setIsSubmitting(true);
    try {
      console.log('useSecureAuth: Attempting sign in for:', email.toLowerCase().trim());
      await originalSignIn(email.toLowerCase().trim(), password);
      console.log('useSecureAuth: Sign in successful');
    } catch (error: any) {
      console.error('useSecureAuth: Sign in failed:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || 'Failed to sign in',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    signUp,
    signIn,
    isSubmitting,
  };
}
