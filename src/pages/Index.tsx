
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [hasCheckedUrl, setHasCheckedUrl] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  // Handle URL checking for email verification
  useEffect(() => {
    if (!authLoading && !hasCheckedUrl) {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const type = urlParams.get('type') || hashParams.get('type');
      const error = urlParams.get('error') || hashParams.get('error');
      
      console.log('URL check:', { accessToken: !!accessToken, type, error });
      
      if ((accessToken || type === 'signup') && !error) {
        console.log('Email verification detected, setting redirect to verification success');
        // Clean URL first
        window.history.replaceState({}, document.title, window.location.pathname);
        setShouldRedirect('/verification-success');
      }
      
      setHasCheckedUrl(true);
    }
  }, [authLoading, hasCheckedUrl]);

  // Handle auth-based redirects
  useEffect(() => {
    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });

    if (!authLoading && hasCheckedUrl && !shouldRedirect) {
      // Navigate confirmed users to workspace
      if (user && userProfile && (user.email_confirmed_at || isAdmin)) {
        console.log('Setting redirect to workspace for confirmed user');
        setShouldRedirect('/workspace');
      }
      // Redirect to signup for new users
      else if (!user) {
        console.log('Setting redirect to signup for new users');
        setShouldRedirect('/signup');
      }
    }
  }, [user, userProfile, authLoading, isAdmin, hasCheckedUrl, shouldRedirect]);

  // Handle the actual navigation
  useEffect(() => {
    if (shouldRedirect) {
      console.log('Redirecting to:', shouldRedirect);
      navigate(shouldRedirect);
    }
  }, [shouldRedirect, navigate]);

  // Show loading during auth initialization or while checking URL
  if (authLoading || !hasCheckedUrl) {
    return <LoadingScreen />;
  }

  // Show email confirmation screen for unverified users
  if (user && !user.email_confirmed_at && !isAdmin && !shouldRedirect) {
    return (
      <EmailConfirmationScreen 
        userEmail={user.email || ''} 
        onBackToSignIn={() => setShouldRedirect('/signin')}
      />
    );
  }

  return <LoadingScreen />;
};

export default Index;
