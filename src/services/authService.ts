
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
    
    console.log('User profile fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  referralCode?: string
) => {
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
    throw error;
  }

  console.log('Signup response:', data);

  if (data.user && !data.user.email_confirmed_at) {
    console.log('Email not confirmed, showing toast');
    toast({
      title: "Check Your Email",
      description: "We've sent you a confirmation link. Please check your email and click the link to verify your account.",
    });
  } else if (data.user && data.user.email_confirmed_at) {
    console.log('Email confirmed, user signed in');
  }

  return data;
};

export const signInUser = async (email: string, password: string) => {
  console.log('Attempting signin for:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('Signin response:', data, error);

  if (error) {
    console.error('Signin error details:', error);
    
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

  console.log('Signin successful for user:', data.user.email);
  return data;
};

export const signOutUser = async () => {
  console.log('Attempting signout');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  console.log('Signout successful');
  toast({
    title: "Logged Out",
    description: "You have been successfully logged out",
  });
};
