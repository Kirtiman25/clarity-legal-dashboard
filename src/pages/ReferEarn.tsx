
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import AppLayout from '@/components/layouts/AppLayout';

const ReferEarn = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Refer and Earn" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <ReferralDashboard />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ReferEarn;
