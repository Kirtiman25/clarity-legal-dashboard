
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [hasCheckedUrl, setHasCheckedUrl] = useState(false);

  useEffect(() => {
    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });
    
    // Check for email verification in URL only once
    if (!authLoading && !hasCheckedUrl) {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const type = urlParams.get('type') || hashParams.get('type');
      const error = urlParams.get('error') || hashParams.get('error');
      
      console.log('URL check:', { accessToken: !!accessToken, type, error });
      
      if ((accessToken || type === 'signup') && !error) {
        console.log('Email verification detected, redirecting to success page');
        // Clean URL first
        window.history.replaceState({}, document.title, window.location.pathname);
        // Navigate to verification success page
        navigate('/verification-success');
        return;
      }
      
      setHasCheckedUrl(true);
    }
    
    // Navigate confirmed users to workspace
    if (!authLoading && user && userProfile && (user.email_confirmed_at || isAdmin)) {
      console.log('Redirecting confirmed user to workspace');
      navigate('/workspace');
    }
  }, [user, userProfile, authLoading, isAdmin, navigate, hasCheckedUrl]);

  // Show loading during auth initialization
  if (authLoading) {
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

  // Redirect to signup page for new users
  if (!user) {
    navigate('/signup');
    return <LoadingScreen />;
  }

  return <LoadingScreen />;
};

export default Index;
