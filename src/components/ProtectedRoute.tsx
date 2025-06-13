
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
      
      // For admin users, allow access even without profile
      if (user && !userProfile && user.email !== 'uttamkumar30369@gmail.com') {
        console.log('ProtectedRoute: No user profile found for non-admin, waiting...');
        // Don't redirect immediately, wait a bit for profile to load
        const timeoutId = setTimeout(() => {
          if (!userProfile) {
            console.log('ProtectedRoute: Profile load timeout, redirecting to signin');
            navigate('/signin');
          }
        }, 2000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, userProfile, loading, navigate]);

  // Show loading while auth is initializing
  if (loading) {
    return <LoadingScreen />;
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return <LoadingScreen />;
  }

  // For non-admin users, wait for profile to load
  if (!userProfile && user.email !== 'uttamkumar30369@gmail.com') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
