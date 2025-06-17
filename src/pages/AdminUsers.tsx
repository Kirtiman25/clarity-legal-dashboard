
import AdminRoute from '@/components/AdminRoute';
import UserManagement from '@/components/admin/UserManagement';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminNavigation from '@/components/admin/AdminNavigation';

const AdminUsers = () => {
  return (
    <AdminRoute>
      <AdminLayout title="User Management">
        <div className="container mx-auto px-4 py-6 pb-24">
          <UserManagement />
        </div>
        <AdminNavigation />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminUsers;
