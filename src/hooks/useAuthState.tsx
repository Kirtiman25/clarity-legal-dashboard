
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch profile for signed in user
        handleUserProfile(session.user.id);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
      } else {
        setUserProfile(null);
        setLoading(false);
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
        // Don't redirect immediately, give user a chance to retry
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
