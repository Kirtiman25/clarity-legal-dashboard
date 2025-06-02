
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { fetchUserProfile } from '@/services/authService';
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
          await handleUserProfile(session.user.id);
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
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', session.user.email);
        }
        
        await handleUserProfile(session.user.id);
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

  const handleUserProfile = async (userId: string) => {
    try {
      console.log('Handling user profile for:', userId);
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        setUserProfile(profile);
        console.log('Profile set successfully:', profile.email);
      } else {
        console.error('Failed to fetch or create user profile');
        toast({
          title: "Profile Error",
          description: "There was an issue loading your profile. Please try refreshing the page.",
          variant: "destructive",
        });
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
