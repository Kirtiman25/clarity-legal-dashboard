
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Only run when auth loading is complete and haven't navigated yet
    if (authLoading || hasNavigated) return;

    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin,
      hasNavigated
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
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/verification-success');
      setHasNavigated(true);
      setIsInitialized(true);
      return;
    }

    // Handle authenticated users - prioritize workspace redirect
    if (user && (user.email_confirmed_at || isAdmin)) {
      console.log('User authenticated and confirmed, redirecting to workspace');
      navigate('/workspace');
      setHasNavigated(true);
      setIsInitialized(true);
      return;
    }

    // Handle authenticated users with profile but unconfirmed email (admin bypass)
    if (user && userProfile && isAdmin) {
      console.log('Admin user with profile, redirecting to workspace');
      navigate('/workspace');
      setHasNavigated(true);
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
      console.log('No user found, redirecting to signup');
      navigate('/signup');
      setHasNavigated(true);
      setIsInitialized(true);
      return;
    }

    // Fallback
    setIsInitialized(true);
  }, [authLoading, user, userProfile, isAdmin, navigate, hasNavigated]);

  // Show loading during auth initialization
  if (authLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  // Show email confirmation screen for unverified users
  if (user && !user.email_confirmed_at && !isAdmin) {
    return (
      <EmailConfirmationScreen 
        userEmail={user.email || ''} 
        onBackToSignIn={() => {
          setHasNavigated(true);
          navigate('/signin');
        }}
      />
    );
  }

  // Fallback loading (shouldn't reach here normally)
  return <LoadingScreen />;
};

export default Index;
