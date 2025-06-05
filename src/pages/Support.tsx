
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import SupportCenter from '@/components/support/SupportCenter';
import AppLayout from '@/components/layouts/AppLayout';

const Support = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Support" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <SupportCenter />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Support;
