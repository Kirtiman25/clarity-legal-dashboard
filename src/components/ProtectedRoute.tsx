
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
    // Only redirect if loading is complete
    if (!loading) {
      if (!user) {
        console.log('ProtectedRoute: No user found, redirecting to signin');
        navigate('/signin');
        return;
      }
      
      // Allow admin users (specific email) to proceed without profile
      const isAdminUser = user.email === 'uttamkumar30369@gmail.com';
      
      // For non-admin users, we need a profile but don't wait too long
      if (!userProfile && !isAdminUser) {
        console.log('ProtectedRoute: No user profile found for non-admin user');
        // Don't redirect immediately, give some time for profile to load
        // but don't wait indefinitely
        return;
      }
      
      console.log('ProtectedRoute: User authorized, rendering content');
    }
  }, [user, userProfile, loading, navigate]);

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
  
  // For non-admin users, show loading if no profile yet
  if (!userProfile && !isAdminUser) {
    console.log('ProtectedRoute: Waiting for user profile to load');
    return <LoadingScreen />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
