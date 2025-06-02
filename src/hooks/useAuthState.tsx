
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
          // Only fetch profile if user is confirmed
          if (session.user.email_confirmed_at) {
            await handleUserProfile(session.user.id);
          } else {
            console.log('User email not confirmed, skipping profile fetch');
            setLoading(false);
          }
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
          if (session.user.email_confirmed_at) {
            toast({
              title: "Welcome!",
              description: "You have been signed in successfully.",
            });
            await handleUserProfile(session.user.id);
          } else {
            toast({
              title: "Email Confirmation Required",
              description: "Please check your email and click the confirmation link.",
              variant: "destructive",
            });
            setLoading(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for user:', session.user.email);
          // Only fetch profile if we don't have one yet
          if (!userProfile && session.user.email_confirmed_at) {
            await handleUserProfile(session.user.id);
          }
        }
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
  }, [userProfile]);

  const handleUserProfile = async (userId: string) => {
    try {
      console.log('Handling user profile for:', userId);
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        setUserProfile(profile);
        console.log('Profile set successfully:', profile.email);
      } else {
        console.log('Profile not found - may be newly created user');
        // For new users, the trigger should create the profile
        // Let's wait a bit and try again
        setTimeout(async () => {
          const retryProfile = await fetchUserProfile(userId);
          if (retryProfile) {
            setUserProfile(retryProfile);
            console.log('Profile found on retry:', retryProfile.email);
          } else {
            console.error('Profile still not found after retry');
          }
        }, 2000);
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
