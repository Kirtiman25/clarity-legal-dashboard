
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePaid?: boolean;
}

const ProtectedRoute = ({ children, requirePaid = false }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if loading is complete and no user
    if (!loading && !user) {
      console.log('ProtectedRoute: No user found, redirecting to signin');
      navigate('/signin');
      return;
    }
  }, [user, loading, navigate]);

  // Show loading while auth is initializing
  if (loading) {
    console.log('ProtectedRoute: Auth loading, showing loading screen');
    return <LoadingScreen />;
  }

  // Don't render if no user (will redirect)
  if (!user) {
    console.log('ProtectedRoute: No user, showing loading screen while redirecting');
    return <LoadingScreen />;
  }

  // Allow admin user to proceed without profile
  const isAdminUser = user.email === 'uttamkumar30369@gmail.com';
  
  console.log('ProtectedRoute: User authorized, rendering content');
  return <>{children}</>;
};

export default ProtectedRoute;
