
import AdminRoute from '@/components/AdminRoute';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminNavigation from '@/components/admin/AdminNavigation';

const AdminAnalytics = () => {
  return (
    <AdminRoute>
      <AdminLayout title="System Analytics">
        <div className="container mx-auto px-4 py-6 pb-24">
          <AnalyticsDashboard />
        </div>
        <AdminNavigation />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminAnalytics;
