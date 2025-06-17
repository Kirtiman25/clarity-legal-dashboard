
import AdminRoute from '@/components/AdminRoute';
import TaskManagement from '@/components/admin/TaskManagement';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminNavigation from '@/components/admin/AdminNavigation';

const AdminTasks = () => {
  return (
    <AdminRoute>
      <AdminLayout title="Task Management">
        <div className="container mx-auto px-4 py-6 pb-24">
          <TaskManagement />
        </div>
        <AdminNavigation />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminTasks;
