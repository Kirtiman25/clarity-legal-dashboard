
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session:', session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await handleUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
        }
        await handleUserProfile(session.user);
      } else {
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

  const handleUserProfile = async (user: User) => {
    try {
      console.log('Handling user profile for:', user.id);
      
      // Try to fetch existing profile with short timeout
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile && !error) {
        console.log('Profile found:', profile.email);
        setUserProfile(profile);
        setLoading(false);
        return;
      }

      // If no profile exists, create one quickly
      console.log('Creating new profile');
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const referredBy = user.user_metadata?.referred_by || null;
      
      // Generate simple referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          referral_code: referralCode,
          referred_by: referredBy,
          is_paid: false,
          role: 'user'
        })
        .select()
        .single();

      if (newProfile && !createError) {
        console.log('Profile created successfully:', newProfile.email);
        setUserProfile(newProfile);
      } else {
        console.error('Failed to create profile, using fallback:', createError);
        // Use fallback profile to prevent blocking
        setUserProfile({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          referral_code: referralCode,
          referred_by: referredBy,
          is_paid: false,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserProfile);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error handling user profile:', error);
      // Always stop loading, even on error
      setLoading(false);
      
      // Use minimal fallback profile
      setUserProfile({
        id: user.id,
        email: user.email!,
        full_name: user.email?.split('@')[0] || 'User',
        referral_code: 'TEMP123',
        referred_by: null,
        is_paid: false,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile);
    }
  };

  return {
    user,
    userProfile,
    loading,
    setLoading
  };
}
