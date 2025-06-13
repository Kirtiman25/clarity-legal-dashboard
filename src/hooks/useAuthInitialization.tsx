
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';
import { useUserProfileOperations } from './useUserProfile';

export function useAuthInitialization() {
  const { fetchUserProfile, createUserProfile, isAdminEmail } = useUserProfileOperations();

  const createMinimalProfile = useCallback((user: User): UserProfile => {
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
  }, [isAdminEmail]);

  const handleUserProfile = useCallback(async (user: User, showWelcome: boolean = false): Promise<UserProfile | null> => {
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
        
        return profile;
      } else {
        // User exists but email not confirmed
        console.log('User email not confirmed, no profile created');
        return null;
      }
    } catch (error) {
      console.error('Error in handleUserProfile:', error);
      return createMinimalProfile(user);
    }
  }, [fetchUserProfile, createUserProfile, isAdminEmail, createMinimalProfile]);

  const initializeAuth = useCallback(async () => {
    console.log('Initializing authentication...');
    
    // Get initial session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      throw error;
    }
    
    console.log('Initial session check:', session?.user?.email || 'No session');
    return session;
  }, []);

  return {
    handleUserProfile,
    initializeAuth
  };
}
