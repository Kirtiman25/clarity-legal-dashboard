
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

        // Get initial session with timeout
        const sessionPromise = initializeAuth();
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve(null), 3000)
        );
        
        const session = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (mounted) {
          if (session?.user) {
            console.log('Session found for user:', session.user.email);
            setUser(session.user);
            
            // Process profile quickly
            try {
              const profile = await handleUserProfile(session.user);
              if (profile && mounted) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Profile processing error:', error);
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
