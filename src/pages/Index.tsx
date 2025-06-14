
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [showLoggedOutState, setShowLoggedOutState] = useState(false);

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

    // No user - show logged out state instead of immediately redirecting
    if (!user) {
      console.log('No user found, showing logged out state');
      setShowLoggedOutState(true);
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

  // Show logged out welcome page
  if (showLoggedOutState || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <img 
            src="/lovable-uploads/fa1e0532-ff2a-474a-a3c6-ce13d2cbb813.png" 
            alt="Clar Catalyst Logo" 
            className="h-24 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Clar Catalyst
          </h1>
          <p className="text-gray-600 mb-6">
            Your gateway to legal excellence and career growth.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/signin')} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline" 
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading (shouldn't reach here normally)
  return <LoadingScreen />;
};

export default Index;
