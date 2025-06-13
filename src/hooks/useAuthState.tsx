
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';
import { useUserProfileOperations } from './useUserProfile';
import { useSessionOperations } from './useSessionOperations';
import { useAuthNotifications } from './useAuthNotifications';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const { fetchUserProfile, createUserProfile, isAdminEmail } = useUserProfileOperations();
  const { handleConnectionError } = useSessionOperations();
  const { showWelcomeToast } = useAuthNotifications();

  const createMinimalProfile = (user: User): UserProfile => {
    const isAdmin = isAdminEmail(user.email || '');
    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referred_by: user.user_metadata?.referred_by || null,
      is_paid: isAdmin ? true : false,
      role: isAdmin ? 'admin' : 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const handleUserProfile = async (user: User, showWelcome: boolean = false) => {
    console.log('Processing user profile for:', user.email);
    
    try {
      const isAdmin = isAdminEmail(user.email || '');
      
      // For confirmed users or admins, create/fetch profile
      if (user.email_confirmed_at || isAdmin) {
        console.log('User email confirmed or admin, processing profile...');
        
        let profile: UserProfile | null = null;
        
        try {
          profile = await fetchUserProfile(user.id);
        } catch (error) {
          console.log('Error fetching profile, will create minimal profile:', error);
        }
        
        if (!profile) {
          console.log('No profile found, attempting to create one...');
          try {
            profile = await createUserProfile(user);
          } catch (error) {
            console.log('Error creating profile, using minimal profile:', error);
            profile = createMinimalProfile(user);
          }
        }
        
        if (!profile) {
          console.log('Creating minimal profile as fallback...');
          profile = createMinimalProfile(user);
        }
        
        setUserProfile(profile);
        
        if (showWelcome) {
          showWelcomeToast();
        }
      } else {
        // User exists but email not confirmed
        console.log('User email not confirmed, no profile created');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error in handleUserProfile:', error);
      const minimalProfile = createMinimalProfile(user);
      setUserProfile(minimalProfile);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        console.log('Initial session check:', session?.user?.email || 'No session');
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // Process profile immediately for faster loading
            await handleUserProfile(session.user);
          } else {
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
          await handleUserProfile(session.user, event === 'SIGNED_IN');
          if (mounted) setLoading(false);
        } else if (session.user.email_confirmed_at || isAdminEmail(session.user.email || '')) {
          await handleUserProfile(session.user);
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
    });

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Reduced failsafe timeout from 10 seconds to 5 seconds
  useEffect(() => {
    const failsafe = setTimeout(() => {
      if (!initialized) {
        console.log('Auth initialization failsafe triggered');
        setLoading(false);
        setInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(failsafe);
  }, [initialized]);

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
