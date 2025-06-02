
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  referralCode?: string
) => {
  console.log('Attempting signup for:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
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
    console.error('Signup error:', error);
    throw error;
  }

  console.log('Signup response:', { user: !!data.user, session: !!data.session });

  // Check if email confirmation is required
  if (data.user && !data.session) {
    console.log('Email confirmation required for:', email);
    toast({
      title: "Check your email",
      description: "Please check your email and click the confirmation link to complete registration.",
    });
  } else if (data.user && data.session) {
    console.log('User signed up and signed in immediately:', email);
    toast({
      title: "Account Created!",
      description: "Welcome! Your account has been created successfully.",
    });
  }

  console.log('Signup successful for:', email);
  return data;
};

export const signInUser = async (email: string, password: string) => {
  console.log('Attempting signin for:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Signin error:', error);
    
    let errorMessage = error.message;
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = "Invalid email or password. If you just signed up, please check your email for a confirmation link first.";
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = "Please check your email and click the confirmation link before signing in.";
    } else if (error.message.includes('signup_disabled')) {
      errorMessage = "Account signup is currently disabled. Please contact support.";
    }
    
    throw new Error(errorMessage);
  }

  console.log('Signin successful for user:', data.user?.email);
  return data;
};

export const signOutUser = async () => {
  console.log('Attempting signout');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Signout error:', error);
    throw error;
  }
  
  console.log('Signout successful');
  toast({
    title: "Logged Out",
    description: "You have been successfully logged out",
  });
};
