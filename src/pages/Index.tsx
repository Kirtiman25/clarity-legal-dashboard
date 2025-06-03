import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { sanitizeText } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { signUp, signIn, isSubmitting } = useSecureAuth();

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!isLogin && !formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = field === 'email' ? value.toLowerCase().trim() : sanitizeText(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.fullName, formData.referralCode);
        // Clear form after successful signup
        setFormData({ fullName: '', email: '', password: '', referralCode: '' });
        // Don't switch to login mode immediately, let the email confirmation screen show
        console.log('Signup completed, user should see email confirmation screen');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Error handling is done in useSecureAuth, no need to show toast here
    }
  };

  // Show loading only when authLoading is true and we don't have a clear auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user exists but email is not confirmed, show email confirmation screen
  if (user && !user.email_confirmed_at && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/bf6a79a0-729c-4263-ac44-d1f2cda8c9cb.png" 
                alt="Clar Catalyst Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email Confirmation Required
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                Please check your email ({user.email}) and click the confirmation link to complete your registration.
                Once confirmed, you can sign in to access your account.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => {
                setFormData({ fullName: '', email: '', password: '', referralCode: '' });
                setIsLogin(true);
              }}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/bf6a79a0-729c-4263-ac44-d1f2cda8c9cb.png" 
              alt="Clar Catalyst Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join Legal Dashboard'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </CardHeader>
        
        <CardContent>
          {!isLogin && (
            <Alert className="mb-4 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-xs">
                You'll need to confirm your email before signing in
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required={!isLogin}
                  className={`h-12 ${formErrors.fullName ? 'border-red-500' : ''}`}
                  maxLength={50}
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs">{formErrors.fullName}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={`h-12 ${formErrors.email ? 'border-red-500' : ''}`}
                maxLength={254}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? "Enter your password" : "Min 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className={`h-12 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                  maxLength={128}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs">{formErrors.password}</p>
              )}
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code"
                  value={formData.referralCode}
                  onChange={(e) => handleInputChange('referralCode', e.target.value)}
                  className="h-12"
                  maxLength={6}
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormErrors({});
                  setFormData({ fullName: '', email: '', password: '', referralCode: '' });
                }}
                className="ml-2 font-semibold text-orange-600 hover:text-orange-800"
                disabled={isSubmitting}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            {isLogin && (
              <p className="text-xs text-gray-500 mt-2">
                If you just signed up, please check your email for a confirmation link first.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
