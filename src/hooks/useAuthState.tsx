
import { useEffect } from 'react';
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
    if (initialized) return;
    
    let mounted = true;
    let subscription: any = null;
    
    const initializeAuthState = async () => {
      try {
        console.log('useAuthState: Starting initialization...');
        
        // Set up auth listener first
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            console.log('useAuthState: Auth event:', event, session?.user?.email || 'No session');
            await handleAuthStateChange(event, session, mounted);
          }
        });
        subscription = data.subscription;

        // Get initial session
        const session = await initializeAuth();
        
        if (mounted) {
          if (session?.user) {
            console.log('useAuthState: Initial session found:', session.user.email);
            setUser(session.user);
            
            // Handle profile for confirmed users or admin
            if (session.user.email_confirmed_at || session.user.email === 'uttamkumar30369@gmail.com') {
              try {
                const profile = await handleUserProfile(session.user);
                if (mounted && profile) {
                  setUserProfile(profile);
                }
              } catch (error) {
                console.error('useAuthState: Profile error:', error);
              }
            }
          } else {
            console.log('useAuthState: No initial session');
            setUser(null);
            setUserProfile(null);
          }
          
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('useAuthState: Initialization error:', error);
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
