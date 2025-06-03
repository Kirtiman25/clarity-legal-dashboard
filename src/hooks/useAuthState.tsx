
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

  const handleUserProfile = async (user: User) => {
    if (user.email_confirmed_at) {
      console.log('Email confirmed, fetching/creating profile...');
      
      try {
        // Add a maximum time limit for the entire profile handling process
        const profileTimeout = setTimeout(() => {
          console.warn('Profile handling taking too long, clearing loading state');
          setLoading(false);
        }, 15000);

        let profile = await fetchUserProfile(user.id);
        
        if (!profile) {
          console.log('No profile found, creating new one...');
          profile = await createUserProfile(user);
        } else {
          console.log('Found existing profile:', profile);
        }
        
        // Clear the timeout since we completed successfully
        clearTimeout(profileTimeout);
        
        if (profile) {
          setUserProfile(profile);
          console.log('Profile set successfully, clearing loading state');
        } else {
          console.error('Failed to create or fetch profile, but continuing...');
          // Don't block the user from proceeding even if profile creation fails
        }
      } catch (error) {
        console.error('Error in handleUserProfile:', error);
        // Don't block the user, just log the error
      } finally {
        console.log('Clearing loading state in handleUserProfile finally block');
        setLoading(false);
      }
    } else {
      console.log('Email not confirmed yet, not creating profile');
      setUserProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Set a maximum initialization time
        const initTimeout = setTimeout(() => {
          console.warn('Auth initialization taking too long, clearing loading state');
          if (mounted) {
            setLoading(false);
          }
        }, 20000);
        
        const session = await getSessionWithRetry();
        
        // Clear timeout since we got a response
        clearTimeout(initTimeout);
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found in session, checking email confirmation status...');
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

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Auth state change: User signed in, checking email confirmation...');
        
        if (session.user.email_confirmed_at) {
          console.log('Email confirmed, handling profile...');
          
          if (event === 'SIGNED_IN') {
            console.log('User signed in with confirmed email, showing welcome toast');
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
