
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Users, Shield, Home, Settings, BarChart3, Database, Activity, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useSimpleAuth';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const adminMenuItems = [
    { icon: Home, label: 'Admin Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Settings, label: 'Task Management', path: '/admin/tasks' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Database, label: 'Database Admin', path: '/admin/database' },
    { icon: Activity, label: 'System Monitor', path: '/admin/monitor' },
    { icon: Eye, label: 'User View', path: '/workspace' }
  ];

  if (!user || !isAdmin) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
  const displayEmail = user.email || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 border-b border-red-700 shadow-sm z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Admin Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-red-100">{title}</p>
              </div>
            </div>
          </div>
          
          {/* Right Section - Profile */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-red-700">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-red-800 text-white">
                      {displayName.charAt(0)?.toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56 bg-white shadow-lg border" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                    <p className="text-xs text-red-600 font-medium flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>System Administrator</span>
                    </p>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {adminMenuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600"
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
