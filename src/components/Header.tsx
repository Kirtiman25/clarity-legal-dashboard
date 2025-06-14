
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Users, Trophy, Home, MessageSquare, BarChart3, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Header: Starting logout process');
      
      // Call signOut and wait for it to complete
      await signOut();
      
      console.log('Header: Logout completed, forcing navigation');
      
      // Force immediate navigation and page refresh
      window.location.href = '/';
      
    } catch (error) {
      console.error('Header: Logout error:', error);
      // Even if there's an error, force navigation to clear state
      window.location.href = '/';
    }
  };

  const menuItems = [
    { icon: Home, label: 'Workspace', path: '/workspace' },
    { icon: Users, label: 'Refer and Earn', path: '/refer-earn' },
    { icon: Trophy, label: 'Achieve and Earn', path: '/achieve-earn' },
    { icon: MessageSquare, label: 'Support', path: '/support' },
    { icon: BarChart3, label: 'Tracker', path: '/tracker' }
  ];

  // Don't render if no user at all
  if (!user) return null;

  // Use userProfile if available, otherwise fall back to user data
  const displayName = userProfile?.full_name || user.email?.split('@')[0] || 'User';
  const displayEmail = userProfile?.email || user.email || '';

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/fa1e0532-ff2a-474a-a3c6-ce13d2cbb813.png" 
            alt="Clar Catalyst Logo" 
            className="h-20 w-auto"
          />
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile?.profile_picture} />
                <AvatarFallback className="bg-orange-500 text-white">
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
                {loading && <p className="text-xs text-gray-400">Loading profile...</p>}
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
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
