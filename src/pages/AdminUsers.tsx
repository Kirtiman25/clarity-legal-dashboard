
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AdminRoute from '@/components/AdminRoute';
import UserManagement from '@/components/admin/UserManagement';
import AppLayout from '@/components/layouts/AppLayout';

const AdminUsers = () => {
  return (
    <AdminRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="User Management" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <UserManagement />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </AdminRoute>
  );
};

export default AdminUsers;
