
import { useAuth } from '@/hooks/useAuth';
import { useReferralData } from '@/hooks/useReferralData';
import ReferralStats from './ReferralStats';
import ReferralCode from './ReferralCode';
import ReferralRewards from './ReferralRewards';

const ReferralDashboard = () => {
  const { user, userProfile } = useAuth();
  const { stats, gifts, loading } = useReferralData(user?.id);

  return (
    <div className="space-y-6">
      <ReferralStats 
        totalReferrals={stats.totalReferrals}
        referralEarnings={stats.referralEarnings}
        pendingRewards={stats.pendingRewards}
      />

      <ReferralCode referralCode={userProfile?.referral_code} />

      <ReferralRewards gifts={gifts} totalReferrals={stats.totalReferrals} />
    </div>
  );
};

export default ReferralDashboard;
