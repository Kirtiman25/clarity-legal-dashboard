
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
        
        toast({
          title: "Profile Creation Error",
          description: "There was an issue creating your profile. Please contact support if this persists.",
          variant: "destructive",
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

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found in session, fetching/creating profile...');
            // Try to fetch existing profile first
            let profile = await fetchUserProfile(session.user.id);
            
            // If no profile exists, create one
            if (!profile) {
              console.log('No profile found, creating new one...');
              profile = await createUserProfile(session.user);
            } else {
              console.log('Found existing profile:', profile);
            }
            
            setUserProfile(profile);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) setLoading(false);
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
        console.log('Auth state change: User signed in, handling profile...');
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in, showing welcome toast');
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
        
        // Handle user profile for signed in user
        let profile = await fetchUserProfile(session.user.id);
        
        if (!profile) {
          console.log('Creating profile after auth change...');
          profile = await createUserProfile(session.user);
        }
        
        setUserProfile(profile);
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
