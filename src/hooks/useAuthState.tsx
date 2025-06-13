
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionOperations } from './useSessionOperations';
import { useAuthInitialization } from './useAuthInitialization';
import { useAuthEventHandler } from './useAuthEventHandler';
import { useAuthStateManager } from './useAuthStateManager';
import { useAuthFailsafe } from './useAuthFailsafe';

export function useAuthState() {
  const {
    user,
    userProfile,
    loading,
    initialized,
    setUser,
    setUserProfile,
    setLoading,
    setInitialized
  } = useAuthStateManager();

  const { handleConnectionError } = useSessionOperations();
  const { handleUserProfile, initializeAuth } = useAuthInitialization();
  const { handleAuthStateChange } = useAuthEventHandler({
    setUser,
    setUserProfile,
    setLoading,
    handleUserProfile
  });

  useAuthFailsafe({
    initialized,
    setLoading,
    setInitialized
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeAuthState = async () => {
      try {
        console.log('Initializing authentication...');
        const session = await initializeAuth();
        
        if (mounted) {
          if (session?.user) {
            console.log('Session found for user:', session.user.email);
            setUser(session.user);
            // Process profile immediately for faster loading
            const profile = await handleUserProfile(session.user);
            if (profile) {
              setUserProfile(profile);
            }
          } else {
            console.log('No session found');
            setUser(null);
            setUserProfile(null);
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setInitialized(true);
          handleConnectionError();
        }
      }
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'No session');
      if (mounted) {
        await handleAuthStateChange(event, session, mounted);
      }
    });

    // Initialize auth
    initializeAuthState();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove all dependencies to prevent re-initialization

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
