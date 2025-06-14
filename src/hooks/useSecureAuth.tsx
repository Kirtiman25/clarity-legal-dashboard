
import { useState } from 'react';
import { useAuth } from './useAuth';
import { signUpSchema, sanitizeText, createRateLimiter } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';

// Rate limiters for auth operations
const signInRateLimit = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const signUpRateLimit = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export function useSecureAuth() {
  const { signUp: originalSignUp, signIn: originalSignIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (isSubmitting) return;

    // Rate limiting
    if (!signUpRateLimit(email)) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many signup attempts. Please try again later.",
        variant: "destructive",
      });
      throw new Error('Rate limit exceeded');
    }

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

    // Rate limiting
    if (!signInRateLimit(email)) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many login attempts. Please try again in 15 minutes.",
        variant: "destructive",
      });
      throw new Error('Rate limit exceeded');
    }

    // Basic validation for sign in (less strict than signup)
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();

    setIsSubmitting(true);
    try {
      await originalSignIn(cleanEmail, password);
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
