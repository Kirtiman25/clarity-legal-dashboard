
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Gift {
  id: string;
  title: string;
  description: string;
  required_referrals: number;
  image_emoji: string;
}

interface ReferralRewardsProps {
  gifts: Gift[];
  totalReferrals: number;
}

const ReferralRewards = ({ gifts, totalReferrals }: ReferralRewardsProps) => {
  return (
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
                      <Badge variant={totalReferrals >= gift.required_referrals ? "default" : "secondary"}>
                        {gift.required_referrals} referrals needed
                      </Badge>
                      {totalReferrals >= gift.required_referrals && (
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
  );
};

export default ReferralRewards;
