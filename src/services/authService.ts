
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
      
      // If profile doesn't exist, try to create it (backup in case trigger didn't work)
      if (error.code === 'PGRST116') {
        console.log('Profile not found, will be created by trigger or manual creation');
        // Wait a moment for trigger to potentially create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try fetching again
        const { data: retryData, error: retryError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (retryError) {
          console.log('Profile still not found after retry, this is expected for new signups');
          return null;
        }
        
        return retryData;
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

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  referralCode?: string
) => {
  console.log('Attempting signup for:', email);
  
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
      
      toast({
        title: "Email Not Confirmed",
        description: errorMessage,
        variant: "destructive",
        duration: 10000,
      });
      
      // Resend confirmation email
      try {
        await supabase.auth.resend({
          type: 'signup',
          email: email
        });
        console.log('Resent confirmation email to:', email);
        toast({
          title: "Confirmation Email Resent",
          description: "We've sent another confirmation email. Please check your inbox.",
          duration: 5000,
        });
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
