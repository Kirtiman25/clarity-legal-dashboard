
import { useState } from 'react';
import { useAuth } from './useAuth';
import { signUpSchema, sanitizeText } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';

export function useSecureAuth() {
  const { signUp: originalSignUp, signIn: originalSignIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (isSubmitting) return;

    // Validate input
    const validation = signUpSchema.safeParse({
      email: email.toLowerCase().trim(),
      password,
      fullName: sanitizeText(fullName),
      referralCode: referralCode ? sanitizeText(referralCode).toUpperCase() : undefined,
    });

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid input';
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }

    setIsSubmitting(true);
    try {
      await originalSignUp(
        validation.data.email,
        validation.data.password,
        validation.data.fullName,
        validation.data.referralCode
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSubmitting) return;

    // Simple validation - no rate limiting to avoid blocking legitimate requests
    if (!email?.trim() || !password) {
      const error = new Error('Email and password are required');
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log('useSecureAuth: Starting sign in for:', cleanEmail);

    setIsSubmitting(true);
    try {
      await originalSignIn(cleanEmail, password);
      console.log('useSecureAuth: Sign in completed successfully');
    } catch (error: any) {
      console.error('useSecureAuth: Sign in failed:', error);
      setIsSubmitting(false);
      throw error;
    }
    // Don't set isSubmitting to false here - let auth state change handle it
  };

  return {
    signUp,
    signIn,
    isSubmitting,
  };
}
