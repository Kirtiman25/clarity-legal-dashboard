
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Trophy, Users, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useSimpleAuth';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user } = useAuth();

  const userNavItems = [
    { icon: Home, label: 'Home', path: '/workspace' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Trophy, label: 'Achieve', path: '/achieve-earn' },
    { icon: Users, label: 'Refer', path: '/refer-earn' },
    { icon: BarChart3, label: 'Tracker', path: '/tracker' }
  ];

  const adminNavItems = [
    { icon: Home, label: 'Home', path: '/workspace' },
    { icon: Shield, label: 'Admin', path: '/admin/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' }
  ];

  // Show admin navigation if user is admin
  const shouldShowAdminNav = isAdmin && user;
  const navItems = shouldShowAdminNav ? adminNavItems : userNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 h-16 w-16 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
