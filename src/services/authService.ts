
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  referralCode?: string
) => {
  console.log('Starting signup for:', email);
  
  try {
    // Use the verification success route for redirect
    const redirectUrl = `${window.location.origin}/verification-success`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          referred_by: referralCode || null
        },
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Signup error:', error);
      
      if (error.message.includes('signup_disabled') || error.message.includes('Signups not allowed')) {
        throw new Error('Account registration is currently disabled. Please contact support.');
      } else if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else if (error.message.includes('Password')) {
        throw new Error('Password must be at least 6 characters long.');
      }
      
      throw error;
    }

    console.log('Signup successful:', { 
      user: !!data.user, 
      session: !!data.session,
      needsConfirmation: data.user && !data.session
    });

    // Show appropriate message based on email confirmation requirement
    if (data.user && !data.session) {
      console.log('Email confirmation required for:', email);
      toast({
        title: "Registration Successful!",
        description: "Please check your email and click the verification link to activate your account.",
        duration: 8000,
      });
    } else if (data.user && data.session) {
      console.log('User signed up and logged in immediately:', email);
      toast({
        title: "Account Created!",
        description: "Welcome! Your account has been created successfully.",
      });
    }

    return data;
  } catch (error: any) {
    console.error('Signup failed:', error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  console.log('Starting signin for:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link before signing in.";
      } else if (error.message.includes('signup_disabled')) {
        errorMessage = "Account access is currently disabled. Please contact support.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
      }
      
      throw new Error(errorMessage);
    }

    console.log('Signin successful for:', data.user?.email);
    return data;
  } catch (error: any) {
    console.error('Signin failed:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  console.log('AuthService: Starting signout process');
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthService: Signout error:', error);
      throw error;
    }
    
    console.log('AuthService: Signout successful');
    
    // Clear any local storage or session storage if needed
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  } catch (error: any) {
    console.error('AuthService: Signout failed:', error);
    throw error;
  }
};
