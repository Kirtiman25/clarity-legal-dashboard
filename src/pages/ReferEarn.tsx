
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Gift, Instagram, Facebook } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const ReferEarn = () => {
  const [user, setUser] = useState<any>(null);
  const [gifts, setGifts] = useState([
    {
      id: 1,
      title: 'Wireless Headphones',
      description: 'Refer 6 people and get premium wireless headphones',
      requiredReferrals: 6,
      currentReferrals: 2,
      image: '🎧'
    },
    {
      id: 2,
      title: 'Smartphone',
      description: 'Refer 15 people and win a latest smartphone',
      requiredReferrals: 15,
      currentReferrals: 2,
      image: '📱'
    },
    {
      id: 3,
      title: 'Laptop',
      description: 'Refer 25 people and get a premium laptop',
      requiredReferrals: 25,
      currentReferrals: 2,
      image: '💻'
    }
  ]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareReferralCode = (platform: string) => {
    const message = `Join Legal Dashboard with my referral code: ${user?.referralCode}`;
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Refer and Earn" />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        {/* Referral Code Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-white/20 rounded-lg p-4 mb-4">
              <span className="text-2xl font-bold tracking-wider">{user.referralCode}</span>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={copyReferralCode}
                className="text-purple-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Share Buttons */}
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

        {/* Win a Gift Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Gift className="h-6 w-6 mr-2 text-yellow-500" />
            Win a Gift
          </h2>
          
          <div className="space-y-4">
            {gifts.map((gift) => (
              <Card key={gift.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{gift.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{gift.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{gift.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {gift.currentReferrals}/{gift.requiredReferrals} referrals
                          </span>
                          <Badge variant="outline">
                            {Math.round((gift.currentReferrals / gift.requiredReferrals) * 100)}%
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(gift.currentReferrals / gift.requiredReferrals) * 100}%` }}
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
  );
};

export default ReferEarn;
