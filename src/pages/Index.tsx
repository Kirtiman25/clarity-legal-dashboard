
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run when auth loading is complete
    if (authLoading) return;

    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });

    // Check for email verification in URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const type = urlParams.get('type') || hashParams.get('type');
    const error = urlParams.get('error') || hashParams.get('error');
    
    console.log('URL check:', { accessToken: !!accessToken, type, error });
    
    // Handle email verification redirect
    if ((accessToken || type === 'signup') && !error) {
      console.log('Email verification detected, redirecting to verification success');
      // Clean URL first
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/verification-success');
      setIsInitialized(true);
      return;
    }

    // Handle authenticated users with confirmed email or admin status
    if (user && userProfile && (user.email_confirmed_at || isAdmin)) {
      console.log('Redirecting confirmed user to workspace');
      navigate('/workspace');
      setIsInitialized(true);
      return;
    }

    // Handle authenticated users without confirmed email (not admin)
    if (user && !user.email_confirmed_at && !isAdmin) {
      console.log('User email not confirmed, showing confirmation screen');
      setIsInitialized(true);
      return;
    }

    // Handle unauthenticated users
    if (!user) {
      console.log('Redirecting to signup for new users');
      navigate('/signup');
      setIsInitialized(true);
      return;
    }

    // Fallback
    setIsInitialized(true);
  }, [authLoading, user, userProfile, isAdmin, navigate]);

  // Show loading during auth initialization
  if (authLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  // Show email confirmation screen for unverified users
  if (user && !user.email_confirmed_at && !isAdmin) {
    return (
      <EmailConfirmationScreen 
        userEmail={user.email || ''} 
        onBackToSignIn={() => navigate('/signin')}
      />
    );
  }

  // Fallback loading (shouldn't reach here normally)
  return <LoadingScreen />;
};

export default Index;
