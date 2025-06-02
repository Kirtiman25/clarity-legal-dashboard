
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
      
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', userId);
        return await createUserProfile(userId);
      }
      return null;
    }
    
    console.log('User profile fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

const createUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Get user data from auth.users to create profile
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const profileData = {
      id: userId,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      referral_code: generateReferralCode(),
      referred_by: user.user_metadata?.referred_by || null,
      role: 'user' as const,
      is_paid: false
    };

    console.log('Creating user profile:', profileData);

    const { data, error } = await supabase
      .from('users')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    console.log('User profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

const generateReferralCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  referralCode?: string
) => {
  console.log('Attempting signup for:', email);
  
  // Use the current origin for redirect
  const redirectUrl = `${window.location.origin}/`;
  console.log('Using redirect URL:', redirectUrl);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
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

  // Check if user needs to confirm email
  if (data.user && !data.user.email_confirmed_at) {
    console.log('Email confirmation required');
    toast({
      title: "Check Your Email",
      description: "We've sent you a confirmation link. Please check your email and click the link to complete your registration.",
      duration: 10000,
    });
  } else if (data.user && data.user.email_confirmed_at) {
    console.log('User signed up and confirmed automatically');
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
    
    if (error.message.includes('Email not confirmed')) {
      errorMessage = "Please check your email and click the confirmation link before signing in.";
      
      // Offer to resend confirmation email
      toast({
        title: "Email Not Confirmed",
        description: errorMessage + " Would you like us to resend the confirmation email?",
        variant: "destructive",
        duration: 10000,
      });
      
      // Optionally resend confirmation
      try {
        await supabase.auth.resend({
          type: 'signup',
          email: email
        });
        console.log('Resent confirmation email to:', email);
      } catch (resendError) {
        console.error('Failed to resend confirmation:', resendError);
      }
      
    } else if (error.message.includes('Invalid login credentials')) {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
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
