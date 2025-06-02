
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
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fetched user profile:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const createUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('Creating user profile for:', user.email);
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: false,
        role: 'user' as const,
      };

      console.log('Inserting profile data:', profileData);
      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile in DB:', error);
        // Still return the profile data even if DB insert fails
        const fallbackProfile: UserProfile = {
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('Using fallback profile:', fallbackProfile);
        return fallbackProfile;
      }

      console.log('Successfully created user profile:', data);
      return data;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.email || 'No session');
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found in initial session, setting up profile...');
          // Try to fetch existing profile from database
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create new profile if doesn't exist
            console.log('No existing profile found, creating new one...');
            const newProfile = await createUserProfile(session.user);
            setUserProfile(newProfile);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          console.log('User signed in, showing welcome toast');
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
        
        console.log('Setting up user profile after auth change...');
        // Try to fetch existing profile from database
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUserProfile(profile);
        } else {
          // Create new profile if doesn't exist
          console.log('Creating new profile after auth change...');
          const newProfile = await createUserProfile(session.user);
          setUserProfile(newProfile);
        }
      } else {
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
