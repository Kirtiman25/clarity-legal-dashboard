
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
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
    let subscription: any = null;
    
    const initializeAuthState = async () => {
      try {
        console.log('Initializing authentication...');
        
        // Set up auth state listener first
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email || 'No session');
          if (mounted) {
            await handleAuthStateChange(event, session, mounted);
          }
        });
        subscription = data.subscription;

        // Get initial session
        const session = await initializeAuth();
        
        if (mounted) {
          if (session?.user) {
            console.log('Session found for user:', session.user.email);
            setUser(session.user);
            
            // Don't block the UI for profile loading - set loading to false first
            setLoading(false);
            setInitialized(true);
            
            // Process profile in background
            try {
              const profile = await handleUserProfile(session.user);
              if (mounted) {
                setUserProfile(profile);
                console.log('Profile loaded successfully:', profile?.email);
              }
            } catch (error) {
              console.error('Profile processing error:', error);
              // Profile failure doesn't prevent app usage
              if (mounted) {
                setUserProfile(null);
              }
            }
          } else {
            console.log('No session found');
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
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

    // Initialize immediately
    initializeAuthState();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Remove initialized dependency to prevent re-initialization

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
