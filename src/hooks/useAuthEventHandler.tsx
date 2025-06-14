
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
      console.log('User signed out, clearing state');
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      
      // Force a page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      return;
    }
    
    if (session?.user) {
      console.log('Setting user from session:', session.user.email);
      setUser(session.user);
      
      // Handle sign in - show welcome toast and process profile
      if (event === 'SIGNED_IN') {
        console.log('User signed in, processing profile...');
        showWelcomeToast();
        
        // Process profile for confirmed users or admins
        if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
          try {
            const profile = await handleUserProfile(session.user, false);
            if (profile && mounted) {
              setUserProfile(profile);
              console.log('Profile set after sign in:', profile.email);
            }
          } catch (error) {
            console.error('Error processing profile after sign in:', error);
            // Don't fail auth if profile fails
            setUserProfile(null);
          }
        }
        
        // Always clear loading after sign in
        setLoading(false);
        
      } else if (event === 'TOKEN_REFRESHED') {
        // Handle token refresh - don't change loading state
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
      } else {
        // Initial session or other events
        if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
          console.log('Processing profile for confirmed user or admin');
          
          try {
            const profile = await handleUserProfile(session.user, false);
            if (profile && mounted) {
              setUserProfile(profile);
              console.log('Profile set for initial session:', profile.email);
            }
          } catch (error) {
            console.error('Error processing profile:', error);
            setUserProfile(null);
          }
        } else {
          console.log('User email not confirmed yet');
          setUserProfile(null);
        }
        
        // Clear loading for initial session
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
