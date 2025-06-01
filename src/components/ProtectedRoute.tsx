
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePaid?: boolean;
}

const ProtectedRoute = ({ children, requirePaid = true }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/');
        return;
      }
      
      if (!userProfile) {
        console.log('No user profile found, redirecting to login');
        navigate('/');
        return;
      }
      
      if (requirePaid && !userProfile.is_paid) {
        console.log('User is not paid, access denied');
        navigate('/');
        return;
      }
    }
  }, [user, userProfile, loading, navigate, requirePaid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // More secure check - deny access if any condition fails
  if (!user || !userProfile || (requirePaid && !userProfile.is_paid)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
