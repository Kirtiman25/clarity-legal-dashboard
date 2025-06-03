
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';
import type { User } from '@supabase/supabase-js';

export const useUserProfileOperations = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No user profile found, this is normal for new users');
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Successfully fetched user profile:', data);
      return data;
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
      return null;
    }
  };

  const createUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('Creating user profile for:', user.email);
      console.log('User metadata:', user.user_metadata);
      
      // Generate a unique referral code
      const generateReferralCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      };

      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: generateReferralCode(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: false,
        role: 'user' as const,
      };

      console.log('Attempting to insert profile data:', profileData);
      
      // Add timeout for profile creation too
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile creation timeout')), 10000);
      });
      
      const createPromise = supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      const { data, error } = await Promise.race([createPromise, timeoutPromise]);

      if (error) {
        console.error('Error creating user profile:', error);
        console.error('Error details:', error.details, error.hint, error.message);
        
        // If it's a duplicate key error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('Profile already exists, fetching existing profile...');
          const existingProfile = await fetchUserProfile(user.id);
          if (existingProfile) {
            return existingProfile;
          }
        }
        
        // Create a minimal profile to prevent loading loops
        console.log('Creating minimal profile to prevent loading issues...');
        const minimalProfile: UserProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          referral_code: generateReferralCode(),
          referred_by: user.user_metadata?.referred_by || null,
          is_paid: false,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return minimalProfile;
      }

      console.log('Successfully created user profile:', data);
      return data;
    } catch (error) {
      console.error('Exception in createUserProfile:', error);
      
      // Return minimal profile to prevent loading loops
      const minimalProfile: UserProfile = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: false,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return minimalProfile;
    }
  };

  return {
    fetchUserProfile,
    createUserProfile
  };
};
