
import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, Gift } from 'lucide-react';

interface ReferralStatsProps {
  totalReferrals: number;
  referralEarnings: number;
  pendingRewards: number;
}

const ReferralStats = ({ totalReferrals, referralEarnings, pendingRewards }: ReferralStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold">{totalReferrals}</p>
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
              <p className="text-2xl font-bold text-green-600">₹{referralEarnings}</p>
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
              <p className="text-2xl font-bold text-orange-600">₹{pendingRewards}</p>
            </div>
            <Gift className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;
