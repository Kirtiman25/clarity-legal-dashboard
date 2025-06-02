
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { fetchUserProfile, createUserProfile } from '@/services/authService';
import type { UserProfile } from '@/types/auth';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session:', session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await handleUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
        await handleUserProfile(session.user);
      } else {
        setUserProfile(null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUserProfile = async (user: User) => {
    try {
      console.log('Handling user profile for:', user.id);
      
      // Try to fetch existing profile
      let profile = await fetchUserProfile(user.id);
      
      // If no profile exists, create one
      if (!profile) {
        console.log('No profile found, creating new profile');
        const fullName = user.user_metadata?.full_name || 'User';
        const referredBy = user.user_metadata?.referred_by || null;
        
        profile = await createUserProfile(user.id, user.email!, fullName, referredBy);
      }
      
      if (profile) {
        setUserProfile(profile);
        console.log('Profile set successfully:', profile.email);
      } else {
        console.error('Failed to create or fetch user profile');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error handling user profile:', error);
      setLoading(false);
    }
  };

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
