import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, CheckSquare, DollarSign, AlertCircle, Settings, BarChart3, Shield, Database, Activity } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AdminRoute from '@/components/AdminRoute';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layouts/AppLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    pendingTasks: 0,
    totalEarnings: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile) {
      fetchStats();
    }
  }, [userProfile]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch total tasks
      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      // Fetch pending tasks
      const { count: pendingTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total earnings
      const { data: earningsData } = await supabase
        .from('earnings')
        .select('amount');

      const totalEarnings = earningsData?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalTasks: totalTasks || 0,
        pendingTasks: pendingTasks || 0,
        totalEarnings,
        activeUsers: totalUsers || 0 // Simplified for now
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Earnings',
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: Users,
      color: 'bg-blue-500',
      route: '/admin/users'
    },
    {
      title: 'Task Management',
      description: 'View and manage all tasks',
      icon: CheckSquare,
      color: 'bg-green-500',
      route: '/admin/tasks'
    },
    {
      title: 'System Monitor',
      description: 'Real-time system monitoring',
      icon: Activity,
      color: 'bg-red-500',
      route: '/admin/monitor'
    },
    {
      title: 'Database Admin',
      description: 'Database management tools',
      icon: Database,
      color: 'bg-indigo-500',
      route: '/admin/database'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      color: 'bg-gray-500',
      route: '/admin/settings'
    },
    {
      title: 'Analytics',
      description: 'View system analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
      route: '/admin/analytics'
    }
  ];

  if (loading) {
    return (
      <AdminRoute>
        <AppLayout>
          <div className="min-h-screen bg-gray-50">
            <Header title="Admin Dashboard" />
            <div className="container mx-auto px-4 pt-20 pb-24">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
            <Navigation />
          </div>
        </AppLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Admin Dashboard" />
          
          <div className="container mx-auto px-4 pt-20 pb-24">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
                <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
              </div>
              <p className="text-sm text-gray-600">
                Admin ID: {userProfile?.id?.substring(0, 8)}... | Full System Access
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {statCards.map((stat, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className={`text-lg font-bold ${stat.textColor}`}>{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-2 rounded-lg`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Admin Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Actions</h3>
              {adminActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => console.log(`Navigate to ${action.route}`)}
                >
                  <CardContent className="flex items-center p-4">
                    <div className={`${action.color} p-3 rounded-lg mr-4`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;
