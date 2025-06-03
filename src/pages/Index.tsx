
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();

  useEffect(() => {
    console.log('Index - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });
    
    // Redirect to workspace if user has profile and either:
    // 1. Email is confirmed, OR
    // 2. User is admin (admin can access without email confirmation)
    if (!authLoading && user && userProfile && (user.email_confirmed_at || isAdmin)) {
      console.log('Redirecting to workspace');
      navigate('/workspace');
    }
  }, [user, userProfile, authLoading, isAdmin, navigate]);

  const handleBackToSignIn = () => {
    // This is handled by the AuthForm component's state management
    console.log('Back to sign in clicked');
  };

  const handleSignupSuccess = () => {
    console.log('Signup completed, user should see email confirmation screen');
  };

  // Show loading only when authLoading is true and we don't have a clear auth state
  if (authLoading) {
    return <LoadingScreen />;
  }

  // If user exists but email is not confirmed AND user is not admin, show email confirmation screen
  if (user && !user.email_confirmed_at && !isAdmin && !authLoading) {
    return (
      <EmailConfirmationScreen 
        userEmail={user.email || ''} 
        onBackToSignIn={handleBackToSignIn}
      />
    );
  }

  // Show the main auth form
  return <AuthForm onSignupSuccess={handleSignupSuccess} />;
};

export default Index;
