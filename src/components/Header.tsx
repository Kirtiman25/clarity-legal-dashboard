
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Users, Trophy, Home, MessageSquare, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useSimpleAuth';
import { useState } from 'react';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
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

  const menuItems = [
    { icon: Home, label: 'Workspace', path: '/workspace' },
    { icon: Users, label: 'Refer and Earn', path: '/refer-earn' },
    { icon: Trophy, label: 'Achieve and Earn', path: '/achieve-earn' },
    { icon: MessageSquare, label: 'Support', path: '/support' },
    { icon: BarChart3, label: 'Tracker', path: '/tracker' }
  ];

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const displayEmail = user.email || '';

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo Section with Admin Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/fa1e0532-ff2a-474a-a3c6-ce13d2cbb813.png" 
              alt="Clar Catalyst Logo" 
              className="h-16 w-auto"
            />
            {isAdmin && (
              <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>ADMIN</span>
              </div>
            )}
          </div>
          <div className="h-8 w-px bg-gray-300"></div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        
        {/* Profile Section - Separate */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" />
                <AvatarFallback className={`text-white ${isAdmin ? 'bg-red-600' : 'bg-orange-500'}`}>
                  {displayName.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
                {isAdmin && (
                  <p className="text-xs text-red-600 font-medium flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Administrator</span>
                  </p>
                )}
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            {menuItems.map((item) => (
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
  );
};

export default Header;
