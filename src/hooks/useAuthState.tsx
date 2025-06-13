
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';
import { useSessionOperations } from './useSessionOperations';
import { useAuthInitialization } from './useAuthInitialization';
import { useAuthEventHandler } from './useAuthEventHandler';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const { handleConnectionError } = useSessionOperations();
  const { handleUserProfile, initializeAuth } = useAuthInitialization();
  const { handleAuthStateChange } = useAuthEventHandler({
    setUser,
    setUserProfile,
    setLoading,
    handleUserProfile
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeAuthState = async () => {
      try {
        const session = await initializeAuth();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // Process profile immediately for faster loading
            const profile = await handleUserProfile(session.user);
            if (profile) {
              setUserProfile(profile);
            }
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
      await handleAuthStateChange(event, session, mounted);
    });

    // Initialize auth
    initializeAuthState();

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
