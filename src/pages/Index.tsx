
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    console.log('Index - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No'
    });
    
    // Only redirect if we have user with confirmed email and profile
    if (!authLoading && user && userProfile && user.email_confirmed_at) {
      console.log('Redirecting to workspace');
      navigate('/workspace');
    }
  }, [user, userProfile, authLoading, navigate]);

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

  // If user exists but email is not confirmed, show email confirmation screen
  if (user && !user.email_confirmed_at && !authLoading) {
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
