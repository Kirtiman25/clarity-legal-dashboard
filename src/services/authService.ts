
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

export const createUserProfile = async (
  userId: string,
  email: string,
  fullName: string,
  referralCode?: string
): Promise<UserProfile | null> => {
  try {
    console.log('Creating user profile for:', email);
    
    // Generate a unique referral code
    const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        full_name: fullName,
        referral_code: userReferralCode,
        referred_by: referralCode || null,
        is_paid: false,
        role: 'user'
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      return null;
    }

    console.log('User profile created:', data);
    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
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
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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

  // If user is created but not confirmed, manually create profile
  if (data.user && !data.session) {
    console.log('User created but needs confirmation, creating profile manually');
    await createUserProfile(data.user.id, email, fullName, referralCode);
  }

  // If user is immediately signed in, the trigger should handle profile creation
  if (data.user && data.session) {
    console.log('User signed up and logged in successfully');
    toast({
      title: "Welcome!",
      description: "Your account has been created successfully.",
    });
  }

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
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = "Please check your email and click the confirmation link before signing in.";
    }
    
    throw new Error(errorMessage);
  }

  console.log('Signin successful for user:', data.user?.email);
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
