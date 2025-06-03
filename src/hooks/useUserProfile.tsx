
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';
import type { User } from '@supabase/supabase-js';

export const useUserProfileOperations = () => {
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

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
      
      // Generate a unique referral code
      const generateReferralCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      };

      // Check if this is the admin email and set role accordingly
      const isAdminEmail = user.email === 'clearctalyst123@gmail.com';
      
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: generateReferralCode(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: isAdminEmail ? true : false,
        role: isAdminEmail ? 'admin' as const : 'user' as const,
      };

      console.log('Attempting to insert profile data:', profileData);
      
      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        
        // If it's a duplicate key error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('Profile already exists, fetching existing profile...');
          return await fetchUserProfile(user.id);
        }
        
        return null;
      }

      console.log('Successfully created user profile:', data);
      
      // Show special message for admin user
      if (isAdminEmail) {
        toast({
          title: "Admin Account Created!",
          description: "Welcome! You now have administrator privileges.",
          duration: 5000,
        });
      }
      
      return data;
    } catch (error) {
      console.error('Exception in createUserProfile:', error);
      return null;
    }
  };

  return {
    fetchUserProfile,
    createUserProfile
  };
};
