
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log('Index - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });
    
    // Check URL parameters for email confirmation
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      console.log('Email confirmation tokens detected in URL');
      setShowSuccessMessage(true);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Redirect to workspace if user has profile and either:
    // 1. Email is confirmed, OR
    // 2. User is admin (admin can access without email confirmation)
    if (!authLoading && user && userProfile && (user.email_confirmed_at || isAdmin)) {
      console.log('Redirecting to workspace');
      navigate('/workspace');
    }
  }, [user, userProfile, authLoading, isAdmin, navigate]);

  const handleBackToSignIn = () => {
    setShowSuccessMessage(false);
  };

  const handleSignupSuccess = () => {
    console.log('Signup completed, user should see email confirmation screen');
  };

  // Show loading only when authLoading is true
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Show success message if user just confirmed email
  if (showSuccessMessage && user?.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/bf6a79a0-729c-4263-ac44-d1f2cda8c9cb.png" 
                alt="Clar Catalyst Logo" 
                className="h-32 w-auto"
              />
            </div>
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your email has been confirmed. You can now sign in to access your account.
              </p>
              <button
                onClick={handleBackToSignIn}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
