
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

  const { fetchUserProfile, createUserProfile, isAdminEmail } = useUserProfileOperations();
  const { getSessionWithRetry, handleConnectionError } = useSessionOperations();
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

  const handleUserProfile = async (user: User) => {
    console.log('Starting handleUserProfile for:', user.email);
    
    // Set a timeout to ensure loading doesn't get stuck
    const timeoutId = setTimeout(() => {
      console.log('Profile handling timeout, using minimal profile');
      const minimalProfile = createMinimalProfile(user);
      setUserProfile(minimalProfile);
      setLoading(false);
    }, 10000); // 10 second timeout
    
    try {
      // For admin email, skip email confirmation requirement
      if (!user.email_confirmed_at && !isAdminEmail(user.email || '')) {
        console.log('Email not confirmed yet for non-admin user');
        setUserProfile(null);
        setLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      // For admin emails, proceed even without email confirmation
      if (isAdminEmail(user.email || '')) {
        console.log('Admin email detected, proceeding without email confirmation check');
      } else {
        console.log('Email confirmed, handling profile...');
      }
      
      // Try to fetch existing profile first with timeout
      let profile: UserProfile | null = await Promise.race([
        fetchUserProfile(user.id),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
      ]);
      
      // If no profile exists, try to create one with timeout
      if (!profile) {
        console.log('No profile found, attempting to create new one...');
        profile = await Promise.race([
          createUserProfile(user),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000))
        ]);
      }
      
      // If we still don't have a profile, create a minimal one
      if (!profile) {
        console.log('Creating minimal profile as fallback...');
        profile = createMinimalProfile(user);
      }
      
      console.log('Setting user profile:', profile);
      setUserProfile(profile);
      console.log('Profile handling completed successfully');
      
    } catch (error) {
      console.error('Error in handleUserProfile:', error);
      // Create minimal profile as ultimate fallback
      const minimalProfile = createMinimalProfile(user);
      console.log('Using minimal profile fallback:', minimalProfile);
      setUserProfile(minimalProfile);
    } finally {
      clearTimeout(timeoutId);
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        
        const session = await getSessionWithRetry();
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await handleUserProfile(session.user);
          } else {
            console.log('No session user, setting loading to false');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          console.log('Error occurred, setting loading to false');
          setLoading(false);
          handleConnectionError();
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email || 'No session');
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // For admin emails, skip email confirmation check, for others require it
        if (isAdminEmail(session.user.email || '') || session.user.email_confirmed_at) {
          if (event === 'SIGNED_IN') {
            showWelcomeToast();
          }
          await handleUserProfile(session.user);
        } else {
          console.log('Email not confirmed for non-admin user, clearing profile and setting loading to false');
          setUserProfile(null);
          setLoading(false);
        }
      } else {
        console.log('No user in session, clearing profile and setting loading to false');
        setUserProfile(null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
