
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';
import { useUserProfileOperations } from './useUserProfile';
import { useSessionOperations } from './useSessionOperations';
import { useAuthNotifications } from './useAuthNotifications';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchUserProfile, createUserProfile } = useUserProfileOperations();
  const { getSessionWithRetry, handleConnectionError } = useSessionOperations();
  const { showWelcomeToast } = useAuthNotifications();

  const createMinimalProfile = (user: User): UserProfile => {
    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referred_by: user.user_metadata?.referred_by || null,
      is_paid: false,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const handleUserProfile = async (user: User) => {
    if (user.email_confirmed_at) {
      console.log('Email confirmed, handling profile...');
      
      try {
        // Set a shorter timeout for the entire profile operation
        const profileTimeout = setTimeout(() => {
          console.warn('Profile operation timeout, using minimal profile');
          const minimalProfile = createMinimalProfile(user);
          setUserProfile(minimalProfile);
          setLoading(false);
        }, 8000); // Reduced timeout to 8 seconds

        // Try to fetch existing profile first
        let profile = await fetchUserProfile(user.id);
        
        // If no profile exists, try to create one
        if (!profile) {
          console.log('No profile found, creating new one...');
          profile = await createUserProfile(user);
        }
        
        // Clear the timeout since we completed
        clearTimeout(profileTimeout);
        
        // If we still don't have a profile, create a minimal one
        if (!profile) {
          console.log('Creating minimal profile as fallback...');
          profile = createMinimalProfile(user);
        }
        
        setUserProfile(profile);
        console.log('Profile handling completed successfully');
        
      } catch (error) {
        console.error('Error in handleUserProfile:', error);
        // Create minimal profile as ultimate fallback
        const minimalProfile = createMinimalProfile(user);
        setUserProfile(minimalProfile);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Email not confirmed yet');
      setUserProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Set a timeout for initialization
        const initTimeout = setTimeout(() => {
          console.warn('Auth initialization timeout');
          if (mounted) {
            setLoading(false);
          }
        }, 12000); // 12 second timeout for initialization
        
        const session = await getSessionWithRetry();
        
        clearTimeout(initTimeout);
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await handleUserProfile(session.user);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
          handleConnectionError();
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (session.user.email_confirmed_at) {
          if (event === 'SIGNED_IN') {
            showWelcomeToast();
          }
          await handleUserProfile(session.user);
        } else {
          console.log('Email not confirmed, clearing profile and loading');
          setUserProfile(null);
          setLoading(false);
        }
      } else {
        console.log('No user in session, clearing profile and loading');
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

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
