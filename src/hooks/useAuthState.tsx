
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
        console.log('useAuthState: Initializing authentication...');
        
        // Set up auth state listener first
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('useAuthState: Auth state changed:', event, session?.user?.email || 'No session');
          if (mounted) {
            await handleAuthStateChange(event, session, mounted);
          }
        });
        subscription = data.subscription;

        // Get initial session
        const session = await initializeAuth();
        
        if (mounted) {
          if (session?.user) {
            console.log('useAuthState: Session found for user:', session.user.email);
            setUser(session.user);
            setLoading(false);
            setInitialized(true);
            
            // Process profile in background
            if (session.user.email_confirmed_at || session.user.email === 'uttamkumar30369@gmail.com') {
              try {
                const profile = await handleUserProfile(session.user);
                if (mounted) {
                  setUserProfile(profile);
                  console.log('useAuthState: Profile loaded successfully:', profile?.email);
                }
              } catch (error) {
                console.error('useAuthState: Profile processing error:', error);
                if (mounted) {
                  setUserProfile(null);
                }
              }
            }
          } else {
            console.log('useAuthState: No session found');
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
        }
      } catch (error) {
        console.error('useAuthState: Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          setInitialized(true);
          handleConnectionError();
        }
      }
    };

    initializeAuthState();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [initialized]);

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
