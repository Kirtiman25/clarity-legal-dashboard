import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, DollarSign, Trophy, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Workspace = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      fetchTotalEarnings();
    }
  }, [userProfile]);

  const fetchTotalEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', userProfile?.id?.toString());

      if (error) throw error;

      const total = data.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const menuItems = [
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Workspace" />
        
        <div className="container mx-auto px-4 pt-20 pb-24">
          <Card className="mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium opacity-90">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8" />
                <span className="text-3xl font-bold">₹{totalEarnings.toLocaleString()}</span>
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
    </ProtectedRoute>
  );
};

export default Workspace;
