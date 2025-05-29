
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Gift, Instagram, Facebook } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ReferEarn = () => {
  const [gifts, setGifts] = useState([]);
  const [referralCount, setReferralCount] = useState(0);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile) {
      fetchGifts();
      fetchReferralCount();
    }
  }, [userProfile]);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('required_referrals', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  const fetchReferralCount = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', userProfile.id);

      if (error) throw error;
      setReferralCount(data.length);
    } catch (error) {
      console.error('Error fetching referral count:', error);
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

  const shareReferralCode = (platform: string) => {
    const message = `Join Legal Dashboard with my referral code: ${userProfile?.referral_code}`;
    const url = window.location.origin;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      case 'instagram':
        toast({
          title: "Instagram",
          description: "Copy the referral code and share it on Instagram",
        });
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`);
        break;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Refer and Earn" />
        
        <div className="container mx-auto px-4 pt-20 pb-24">
          <Card className="mb-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Your Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-white/20 rounded-lg p-4 mb-4">
                <span className="text-2xl font-bold tracking-wider">{userProfile?.referral_code}</span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={copyReferralCode}
                  className="text-purple-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => shareReferralCode('whatsapp')}
                  className="flex-1 text-green-600"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => shareReferralCode('instagram')}
                  className="flex-1 text-pink-600"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => shareReferralCode('facebook')}
                  className="flex-1 text-blue-600"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Gift className="h-6 w-6 mr-2 text-yellow-500" />
              Win a Gift
            </h2>
            
            <div className="space-y-4">
              {gifts.map((gift: any) => (
                <Card key={gift.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{gift.image_emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{gift.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{gift.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {referralCount}/{gift.required_referrals} referrals
                            </span>
                            <Badge variant="outline">
                              {Math.round((referralCount / gift.required_referrals) * 100)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((referralCount / gift.required_referrals) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Navigation />
      </div>
    </ProtectedRoute>
  );
};

export default ReferEarn;
