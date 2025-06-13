
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Prevent multiple navigation attempts
    if (authLoading || hasNavigated) return;

    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });

    // Check for email verification in URL first
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const type = urlParams.get('type') || hashParams.get('type');
    const error = urlParams.get('error') || hashParams.get('error');
    
    if ((accessToken || type === 'signup') && !error) {
      console.log('Email verification detected, redirecting to verification success');
      window.history.replaceState({}, document.title, window.location.pathname);
      setHasNavigated(true);
      navigate('/verification-success');
      return;
    }

    // Handle authenticated users
    if (user) {
      // Admin users can access workspace regardless of email confirmation
      if (isAdmin) {
        console.log('Admin user detected, redirecting to workspace');
        setHasNavigated(true);
        navigate('/workspace');
        return;
      }
      
      // Regular users need email confirmation
      if (user.email_confirmed_at) {
        console.log('User email confirmed, redirecting to workspace');
        setHasNavigated(true);
        navigate('/workspace');
        return;
      } else {
        console.log('User email not confirmed, staying on confirmation screen');
        return; // Stay on this page to show email confirmation screen
      }
    }

    // No user - redirect to signup
    if (!user) {
      console.log('No user found, redirecting to signup');
      setHasNavigated(true);
      navigate('/signup');
      return;
    }
  }, [authLoading, user, userProfile, isAdmin, navigate, hasNavigated]);

  // Show loading during auth initialization
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Show email confirmation screen for unverified users (non-admin)
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
