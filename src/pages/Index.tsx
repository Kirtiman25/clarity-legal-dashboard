
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/auth/LoadingScreen';
import EmailConfirmationScreen from '@/components/auth/EmailConfirmationScreen';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, isAdmin } = useAuth();
  const [emailVerificationSuccess, setEmailVerificationSuccess] = useState(false);

  useEffect(() => {
    console.log('Index page - Auth state:', { 
      user: user?.email, 
      userProfile: !!userProfile, 
      authLoading,
      emailConfirmed: user?.email_confirmed_at ? 'Yes' : 'No',
      isAdmin
    });
    
    // Check for email verification in URL only once when not loading
    if (!authLoading && !emailVerificationSuccess) {
      const checkEmailVerification = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for any verification-related parameters
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const type = urlParams.get('type') || hashParams.get('type');
        const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash');
        const error = urlParams.get('error') || hashParams.get('error');
        
        console.log('URL verification check:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type, 
          tokenHash: !!tokenHash,
          error
        });
        
        // If there's an error in the URL, don't show verification success
        if (error) {
          console.log('Error in verification URL:', error);
          window.history.replaceState({}, document.title, window.location.pathname);
          return false;
        }
        
        // Check for verification tokens or confirmation type
        if (accessToken || refreshToken || tokenHash || type === 'signup') {
          console.log('Email verification detected in URL parameters');
          setEmailVerificationSuccess(true);
          window.history.replaceState({}, document.title, window.location.pathname);
          return true;
        }
        
        return false;
      };
      
      checkEmailVerification();
    }
    
    // Handle navigation for authenticated users
    if (!authLoading && user && userProfile && (user.email_confirmed_at || isAdmin) && !emailVerificationSuccess) {
      console.log('Redirecting confirmed user to workspace');
      navigate('/workspace');
    }
  }, [user, userProfile, authLoading, isAdmin, navigate, emailVerificationSuccess]);

  const handleBackToSignIn = () => {
    setEmailVerificationSuccess(false);
  };

  const handleSignupSuccess = () => {
    console.log('Signup successful - user will need to verify email');
  };

  // Show loading during auth initialization
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Show email verification success message
  if (emailVerificationSuccess) {
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Yes, you are successful!</h2>
              <p className="text-gray-600 mb-6">
                Your email has been confirmed and your account is now active. Please go to the sign in page to access your dashboard.
              </p>
              <button
                onClick={handleBackToSignIn}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Sign In Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show email confirmation screen for unverified users
  if (user && !user.email_confirmed_at && !isAdmin) {
    return (
      <EmailConfirmationScreen 
        userEmail={user.email || ''} 
        onBackToSignIn={handleBackToSignIn}
      />
    );
  }

  // Show auth form for new users or sign in
  return <AuthForm onSignupSuccess={handleSignupSuccess} />;
};

export default Index;
