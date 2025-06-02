
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
          // Create a simple profile immediately without database calls
          const simpleProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            referred_by: session.user.user_metadata?.referred_by || null,
            is_paid: false,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUserProfile(simpleProfile);
        }
        
        setLoading(false);
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
        
        // Create simple profile immediately
        const simpleProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          referred_by: session.user.user_metadata?.referred_by || null,
          is_paid: false,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserProfile(simpleProfile);
      } else {
        setUserProfile(null);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
      
      setLoading(false);
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
