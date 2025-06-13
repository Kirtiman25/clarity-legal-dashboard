
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
      
      // Handle sign in or token refresh with confirmed email
      if (event === 'SIGNED_IN') {
        console.log('User signed in, processing profile...');
        const profile = await handleUserProfile(session.user, true);
        if (profile) {
          setUserProfile(profile);
          showWelcomeToast();
        }
        if (mounted) setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session.user.email_confirmed_at) {
        console.log('Token refreshed for confirmed user');
        const profile = await handleUserProfile(session.user);
        if (profile) {
          setUserProfile(profile);
        }
        if (mounted) setLoading(false);
      } else if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
        console.log('Processing profile for confirmed user or admin');
        const profile = await handleUserProfile(session.user);
        if (profile) {
          setUserProfile(profile);
        }
        if (mounted) setLoading(false);
      } else {
        // User not confirmed yet
        console.log('User email not confirmed yet');
        setUserProfile(null);
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
