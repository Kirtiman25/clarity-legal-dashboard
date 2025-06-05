
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AdminRoute from '@/components/AdminRoute';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AppLayout from '@/components/layouts/AppLayout';

const AdminAnalytics = () => {
  return (
    <AdminRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="System Analytics" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <AnalyticsDashboard />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </AdminRoute>
  );
};

export default AdminAnalytics;
