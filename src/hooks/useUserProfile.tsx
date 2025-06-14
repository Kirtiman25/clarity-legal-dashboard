
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';
import type { User } from '@supabase/supabase-js';

export const useUserProfileOperations = () => {
  const isAdminEmail = (email: string) => {
    // Only this specific email should get admin privileges
    return email === 'uttamkumar30369@gmail.com';
  };

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
          console.log('No user profile found in database');
          return null;
        }
        console.error('Error fetching user profile:', error);
        throw error;
      }

      console.log('Successfully fetched user profile:', data);
      
      // Check if this is admin email and update role if needed
      if (data && isAdminEmail(data.email) && data.role !== 'admin') {
        console.log('Updating admin role for:', data.email);
        try {
          const { data: updatedData, error: updateError } = await supabase
            .from('users')
            .update({ 
              role: 'admin',
              is_paid: true
            })
            .eq('id', userId)
            .select()
            .single();
            
          if (updateError) {
            console.error('Error updating admin role:', updateError);
            return data;
          }
          
          console.log('Successfully updated admin role:', updatedData);
          return updatedData;
        } catch (updateError) {
          console.error('Exception updating admin role:', updateError);
          return data;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
      throw error;
    }
  };

  const createUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('Creating user profile for:', user.email);
      
      // Generate a unique referral code
      const generateReferralCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      };

      // Only grant admin privileges to the specific admin email
      const isAdmin = isAdminEmail(user.email || '');
      
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        referral_code: generateReferralCode(),
        referred_by: user.user_metadata?.referred_by || null,
        is_paid: isAdmin ? true : false, // Only admin gets paid status automatically
        role: isAdmin ? 'admin' as const : 'user' as const, // Explicit role assignment
      };

      console.log('Attempting to insert profile data:', {
        ...profileData,
        id: profileData.id.substring(0, 8) + '...' // Log truncated ID for privacy
      });
      
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
        
        throw error;
      }

      console.log('Successfully created user profile:', {
        ...data,
        id: data.id.substring(0, 8) + '...' // Log truncated ID for privacy
      });
      
      // Only show admin message for the actual admin user
      if (isAdmin) {
        toast({
          title: "Admin Account Created!",
          description: "Welcome! You now have administrator privileges.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome! Your profile has been set up.",
          duration: 3000,
        });
      }
      
      return data;
    } catch (error) {
      console.error('Exception in createUserProfile:', error);
      throw error;
    }
  };

  return {
    fetchUserProfile,
    createUserProfile,
    isAdminEmail
  };
};
