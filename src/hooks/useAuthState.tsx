
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
    if (!user.email_confirmed_at) {
      console.log('Email not confirmed yet');
      setUserProfile(null);
      setLoading(false);
      return;
    }

    console.log('Email confirmed, handling profile...');
    
    try {
      // Try to fetch existing profile first with a short timeout
      const profilePromise = fetchUserProfile(user.id);
      const timeoutPromise = new Promise<UserProfile | null>((resolve) => {
        setTimeout(() => {
          console.log('Profile fetch timeout, using minimal profile');
          resolve(null);
        }, 5000); // 5 second timeout for profile fetch
      });

      let profile = await Promise.race([profilePromise, timeoutPromise]);
      
      // If no profile exists, try to create one quickly
      if (!profile) {
        console.log('No profile found, attempting to create new one...');
        const createPromise = createUserProfile(user);
        const createTimeoutPromise = new Promise<UserProfile | null>((resolve) => {
          setTimeout(() => {
            console.log('Profile creation timeout, using minimal profile');
            resolve(null);
          }, 3000); // 3 second timeout for profile creation
        });

        profile = await Promise.race([createPromise, createTimeoutPromise]);
      }
      
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
  };

  useEffect(() => {
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Set a hard timeout for the entire initialization process
        loadingTimeout = setTimeout(() => {
          console.warn('Auth initialization timeout - forcing loading to false');
          if (mounted) {
            setLoading(false);
          }
        }, 10000); // 10 second hard timeout
        
        const session = await getSessionWithRetry();
        
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
      } finally {
        // Clear the timeout since initialization completed
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
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
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
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
