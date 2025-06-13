
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';

export function useAuthStateManager() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const updateAuthState = useCallback((newUser: User | null, newProfile: UserProfile | null) => {
    setUser(newUser);
    setUserProfile(newProfile);
  }, []);

  const setAuthLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const setAuthInitialized = useCallback((isInitialized: boolean) => {
    setInitialized(isInitialized);
  }, []);

  return {
    user,
    userProfile,
    loading,
    initialized,
    setUser,
    setUserProfile,
    setLoading,
    setInitialized,
    updateAuthState,
    setAuthLoading,
    setAuthInitialized
  };
}
