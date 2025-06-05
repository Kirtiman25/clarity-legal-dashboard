
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AdminRoute from '@/components/AdminRoute';
import TaskManagement from '@/components/admin/TaskManagement';
import AppLayout from '@/components/layouts/AppLayout';

const AdminTasks = () => {
  return (
    <AdminRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Task Management" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <TaskManagement />
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </AdminRoute>
  );
};

export default AdminTasks;
