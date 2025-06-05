
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AppLayout from '@/components/layouts/AppLayout';

const Tracker = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Tracker" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <AnalyticsDashboard />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Tracker;
