
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Gift, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

const ReferralDashboard = () => {
  const { user, userProfile } = useAuth();
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

  useEffect(() => {
    // Show content immediately, then fetch data
    if (user) {
      fetchReferralData();
      fetchAvailableGifts();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user?.id) {
      console.log('No user ID available for referral data');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching referral data for user:', user.id);
      
      // Fetch referral count with error handling
      let referralCount = 0;
      try {
        const { count, error: countError } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', user.id);
        
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
          .eq('user_id', user.id)
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

  const copyReferralCode = () => {
    if (userProfile?.referral_code) {
      navigator.clipboard.writeText(userProfile.referral_code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${userProfile?.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.referralEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Rewards</p>
                <p className="text-2xl font-bold text-orange-600">₹{stats.pendingRewards}</p>
              </div>
              <Gift className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Referral Code</label>
            <div className="flex space-x-2 mt-1">
              <Input 
                value={userProfile?.referral_code || 'Loading...'} 
                readOnly 
                className="font-mono text-lg"
              />
              <Button onClick={copyReferralCode} variant="outline" disabled={!userProfile?.referral_code}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Referral Link</label>
            <div className="flex space-x-2 mt-1">
              <Input 
                value={userProfile?.referral_code ? `${window.location.origin}?ref=${userProfile.referral_code}` : 'Loading...'} 
                readOnly 
                className="text-sm"
              />
              <Button onClick={copyReferralLink} variant="outline" disabled={!userProfile?.referral_code}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">How it works:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Share your referral code or link with friends</li>
              <li>• Earn ₹500 for each successful referral</li>
              <li>• Your friends get exclusive benefits too!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Available Gifts */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <Card key={gift.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{gift.image_emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{gift.title}</h4>
                      <p className="text-sm text-gray-600">{gift.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={stats.totalReferrals >= gift.required_referrals ? "default" : "secondary"}>
                          {gift.required_referrals} referrals needed
                        </Badge>
                        {stats.totalReferrals >= gift.required_referrals && (
                          <Button size="sm">Claim</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
