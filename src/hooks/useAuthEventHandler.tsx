
import { useCallback } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useUserProfileOperations } from './useUserProfile';
import { useAuthNotifications } from './useAuthNotifications';

interface AuthEventHandlerProps {
  setUser: (user: any) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  handleUserProfile: (user: any, showWelcome?: boolean) => Promise<UserProfile | null>;
}

export function useAuthEventHandler({
  setUser,
  setUserProfile,
  setLoading,
  handleUserProfile
}: AuthEventHandlerProps) {
  const { isAdminEmail } = useUserProfileOperations();
  const { showWelcomeToast } = useAuthNotifications();

  const handleAuthStateChange = useCallback(async (event: AuthChangeEvent, session: Session | null, mounted: boolean) => {
    if (!mounted) return;
    
    console.log('Processing auth state change:', event, session?.user?.email || 'No session');
    
    // Handle different auth events
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }
    
    if (session?.user) {
      console.log('Setting user from session:', session.user.email);
      setUser(session.user);
      
      // Handle sign in - show welcome toast and process profile
      if (event === 'SIGNED_IN') {
        console.log('User signed in, processing profile...');
        showWelcomeToast();
        
        // Set loading to false immediately to show UI
        setLoading(false);
        
        // Process profile in background
        try {
          const profile = await handleUserProfile(session.user, false);
          if (profile && mounted) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error processing profile after sign in:', error);
        }
        
      } else if (event === 'TOKEN_REFRESHED') {
        // Handle token refresh
        console.log('Token refreshed, checking profile...');
        
        if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
          try {
            const profile = await handleUserProfile(session.user, false);
            if (profile && mounted) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error processing profile after token refresh:', error);
          }
        }
        
        // Always set loading to false for token refresh
        setLoading(false);
      } else {
        // Initial session or other events
        if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
          console.log('Processing profile for confirmed user or admin');
          
          try {
            const profile = await handleUserProfile(session.user, false);
            if (profile && mounted) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error processing profile:', error);
          }
        } else {
          console.log('User email not confirmed yet');
          setUserProfile(null);
        }
        
        // Set loading to false
        setLoading(false);
      }
    } else {
      console.log('No user in session');
      setUser(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, [setUser, setUserProfile, setLoading, handleUserProfile, isAdminEmail, showWelcomeToast]);

  return {
    handleAuthStateChange
  };
}
