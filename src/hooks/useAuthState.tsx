
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No user profile found, this is normal for new users');
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Successfully fetched user profile:', data);
      return data;
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
      return null;
    }
  };

  const createUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('Creating user profile for:', user.email);
      console.log('User metadata:', user.user_metadata);
      
      // Generate a unique referral code
      const generateReferralCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      };

      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: generateReferralCode(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: false,
        role: 'user' as const,
      };

      console.log('Attempting to insert profile data:', profileData);
      
      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        console.error('Error details:', error.details, error.hint, error.message);
        
        // If it's a duplicate key error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('Profile already exists, fetching existing profile...');
          return await fetchUserProfile(user.id);
        }
        
        // Show user-friendly error but don't block the auth flow completely
        toast({
          title: "Profile Setup Issue",
          description: "There was an issue setting up your profile. Some features may be limited.",
          variant: "destructive",
          duration: 8000,
        });
        return null;
      }

      console.log('Successfully created user profile:', data);
      return data;
    } catch (error) {
      console.error('Exception in createUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get initial session with retry logic
        const getSessionWithRetry = async (): Promise<any> => {
          for (let i = 0; i < maxRetries; i++) {
            try {
              const { data: { session }, error } = await supabase.auth.getSession();
              if (error) throw error;
              return session;
            } catch (error) {
              console.warn(`Session fetch attempt ${i + 1} failed:`, error);
              if (i === maxRetries - 1) throw error;
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
            }
          }
        };

        const session = await getSessionWithRetry();
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found in session, checking email confirmation status...');
            // Only try to fetch/create profile if email is confirmed
            if (session.user.email_confirmed_at) {
              console.log('Email confirmed, fetching/creating profile...');
              let profile = await fetchUserProfile(session.user.id);
              
              // If no profile exists, create one
              if (!profile) {
                console.log('No profile found, creating new one...');
                profile = await createUserProfile(session.user);
              } else {
                console.log('Found existing profile:', profile);
              }
              
              setUserProfile(profile);
            } else {
              console.log('Email not confirmed yet, not creating profile');
              setUserProfile(null);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
          // Show error to user if session initialization fails completely
          toast({
            title: "Connection Issue",
            description: "Having trouble connecting. Please refresh the page.",
            variant: "destructive",
            duration: 8000,
          });
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Auth state change: User signed in, checking email confirmation...');
        
        // Only create/fetch profile if email is confirmed
        if (session.user.email_confirmed_at) {
          console.log('Email confirmed, handling profile...');
          
          if (event === 'SIGNED_IN') {
            console.log('User signed in with confirmed email, showing welcome toast');
            toast({
              title: "Welcome!",
              description: "You have been signed in successfully.",
            });
          }
          
          // Handle user profile for confirmed user
          let profile = await fetchUserProfile(session.user.id);
          
          if (!profile) {
            console.log('Creating profile for confirmed user...');
            profile = await createUserProfile(session.user);
          }
          
          setUserProfile(profile);
        } else {
          console.log('Email not confirmed, clearing profile');
          setUserProfile(null);
        }
      } else {
        console.log('No user in session, clearing profile');
        setUserProfile(null);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
