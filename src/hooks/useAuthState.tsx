
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSessionOperations } from './useSessionOperations';
import { useAuthInitialization } from './useAuthInitialization';
import { useAuthEventHandler } from './useAuthEventHandler';
import { useAuthStateManager } from './useAuthStateManager';

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

  useEffect(() => {
    if (initialized) return; // Prevent re-initialization
    
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
            
            // Set loading to false immediately for better UX
            setLoading(false);
            setInitialized(true);
            
            // Process profile in background only for confirmed users or admins
            if (session.user.email_confirmed_at || session.user.email === 'uttamkumar30369@gmail.com') {
              try {
                const profile = await handleUserProfile(session.user);
                if (mounted) {
                  setUserProfile(profile);
                  console.log('Profile loaded successfully:', profile?.email);
                }
              } catch (error) {
                console.error('Profile processing error:', error);
                if (mounted) {
                  setUserProfile(null);
                }
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
  }, [initialized]); // Only depend on initialized to prevent loops

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
