
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Settings, BarChart3, Database, Activity, Home } from 'lucide-react';

const AdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Shield, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Tasks', path: '/admin/tasks' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Home, label: 'User View', path: '/workspace' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 border-t border-red-700 shadow-lg">
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
                  ? 'text-white bg-red-700' 
                  : 'text-red-100 hover:text-white hover:bg-red-700'
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

export default AdminNavigation;
