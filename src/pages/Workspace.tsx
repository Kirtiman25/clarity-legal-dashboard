
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Trophy, Users, Shield, Settings } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useSimpleAuth';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layouts/AppLayout';

const Workspace = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTotalEarnings();
    }
  }, [user]);

  // Debug logging
  useEffect(() => {
    console.log('Workspace - User:', user?.email, 'Is Admin:', isAdmin);
  }, [user, isAdmin]);

  const fetchTotalEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user?.id);

      if (error) throw error;

      const total = data.reduce((sum, earning) => sum + Number(earning.amount), 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const userMenuItems = [
    {
      title: 'Tasks',
      description: 'Manage your pending tasks',
      icon: CheckSquare,
      color: 'bg-orange-500',
      route: '/tasks'
    },
    {
      title: 'Achieve and Earn',
      description: 'Complete goals for bonuses',
      icon: Trophy,
      color: 'bg-green-500',
      route: '/achieve-earn'
    },
    {
      title: 'Refer and Earn',
      description: 'Invite friends and earn rewards',
      icon: Users,
      color: 'bg-purple-500',
      route: '/refer-earn'
    }
  ];

  const adminMenuItems = [
    {
      title: 'Admin Dashboard',
      description: 'System overview and analytics',
      icon: Shield,
      color: 'bg-red-500',
      route: '/admin/dashboard'
    },
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: Users,
      color: 'bg-blue-500',
      route: '/admin/users'
    },
    {
      title: 'Task Management',
      description: 'Configure system tasks',
      icon: Settings,
      color: 'bg-gray-500',
      route: '/admin/tasks'
    },
    ...userMenuItems
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <Header title="Workspace" />
          
          <div className="container mx-auto px-4 pt-24 pb-24">
            {/* Admin Badge and Quick Access */}
            {isAdmin && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 mb-2">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrator
                    </Badge>
                    <p className="text-xs text-gray-600">
                      You have full system access
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/admin/dashboard')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </div>
              </div>
            )}

            <Card className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">
                  {isAdmin ? 'Admin Access' : 'Total Earnings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold">
                    {isAdmin ? 'Full System Access' : `₹${totalEarnings.toLocaleString()}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => navigate(item.route)}
                >
                  <CardContent className="flex items-center p-6">
                    <div className={`${item.color} p-3 rounded-lg mr-4`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Navigation />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Workspace;
