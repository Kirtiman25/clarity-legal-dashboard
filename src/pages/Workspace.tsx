
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, CheckSquare, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const Workspace = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  if (!user) return null;

  const menuItems = [
    {
      title: 'Tasks',
      description: 'Manage your pending tasks',
      icon: CheckSquare,
      color: 'bg-blue-500',
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Workspace" />
      
      <div className="container mx-auto px-4 pt-20 pb-24">
        {/* Total Earnings Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium opacity-90">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8" />
              <span className="text-3xl font-bold">₹{user.totalEarnings?.toLocaleString() || '0'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
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
  );
};

export default Workspace;
