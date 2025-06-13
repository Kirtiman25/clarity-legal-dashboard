
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
    
    console.log('Auth state changed:', event, session?.user?.email || 'No session');
    
    // Handle different auth events
    if (event === 'SIGNED_OUT') {
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }
    
    if (session?.user) {
      setUser(session.user);
      
      // Handle sign in or token refresh with confirmed email
      if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && session.user.email_confirmed_at)) {
        const profile = await handleUserProfile(session.user, event === 'SIGNED_IN');
        if (profile && event === 'SIGNED_IN') {
          showWelcomeToast();
        }
        if (profile) {
          setUserProfile(profile);
        }
        if (mounted) setLoading(false);
      } else if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
        const profile = await handleUserProfile(session.user);
        if (profile) {
          setUserProfile(profile);
        }
        if (mounted) setLoading(false);
      } else {
        // User not confirmed yet
        setUserProfile(null);
        setLoading(false);
      }
    } else {
      setUser(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, [setUser, setUserProfile, setLoading, handleUserProfile, isAdminEmail, showWelcomeToast]);

  return {
    handleAuthStateChange
  };
}
