
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  totalReferrals: number;
  referralEarnings: number;
  pendingRewards: number;
}

interface Gift {
  id: string;
  title: string;
  description: string;
  required_referrals: number;
  image_emoji: string;
}

export const useReferralData = (userId?: string) => {
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    referralEarnings: 0,
    pendingRewards: 0
  });
  const [gifts, setGifts] = useState<Gift[]>([
    {
      id: '1',
      title: 'Cash Bonus',
      description: 'Get ₹500 cash bonus',
      required_referrals: 1,
      image_emoji: '💰'
    },
    {
      id: '2',
      title: 'Premium Service',
      description: 'Free premium service for 1 month',
      required_referrals: 3,
      image_emoji: '⭐'
    },
    {
      id: '3',
      title: 'Special Gift',
      description: 'Exclusive gift package',
      required_referrals: 5,
      image_emoji: '🎁'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchReferralData = async () => {
    if (!userId) {
      console.log('No user ID available for referral data');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching referral data for user:', userId);
      
      // Fetch referral count with error handling
      let referralCount = 0;
      try {
        const { count, error: countError } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', userId);
        
        if (countError) {
          console.log('No referrals table found or error:', countError);
        } else {
          referralCount = count || 0;
        }
      } catch (error) {
        console.log('Error fetching referral count:', error);
      }

      // Fetch referral earnings with error handling
      let totalEarnings = 0;
      try {
        const { data: earnings, error: earningsError } = await supabase
          .from('earnings')
          .select('amount')
          .eq('user_id', userId)
          .like('description', '%referral%');

        if (earningsError) {
          console.log('No earnings table found or error:', earningsError);
        } else {
          totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;
        }
      } catch (error) {
        console.log('Error fetching referral earnings:', error);
      }

      setStats({
        totalReferrals: referralCount,
        referralEarnings: totalEarnings,
        pendingRewards: referralCount * 500 // ₹500 per referral
      });
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('required_referrals', { ascending: true });

      if (error) {
        console.log('No gifts table found, using default gifts:', error);
        return; // Keep default gifts
      }
      
      if (data && data.length > 0) {
        setGifts(data);
      }
    } catch (error) {
      console.log('Error fetching gifts, using defaults:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReferralData();
      fetchAvailableGifts();
    }
  }, [userId]);

  return {
    stats,
    gifts,
    loading,
    refetch: fetchReferralData
  };
};
