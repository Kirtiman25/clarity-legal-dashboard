
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, signUp, signIn } = useAuth();

  useEffect(() => {
    if (user && userProfile) {
      if (userProfile.is_paid) {
        navigate('/workspace');
      }
    }
  }, [user, userProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.fullName, formData.referralCode);
        // After successful signup, switch to login mode
        setIsLogin(true);
        setFormData({ ...formData, password: '', fullName: '', referralCode: '' });
      }
    } catch (error) {
      // Error handling is done in the auth hook
    } finally {
      setLoading(false);
    }
  };

  // Show paid member message if user is logged in but not paid
  if (user && userProfile && !userProfile.is_paid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/bf6a79a0-729c-4263-ac44-d1f2cda8c9cb.png" 
                alt="Clar Catalyst Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              This app is exclusively for paid members only. To become a member or upgrade your membership, call this number.
            </p>
            <div className="bg-orange-100 p-4 rounded-lg mb-4">
              <p className="text-orange-800 font-semibold">+91 9876543210</p>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full"
            >
              Back to Login
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
            <Alert className="mb-4">
              <AlertDescription>
                After creating your account, please check your email for a verification link before signing in.
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
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required={!isLogin}
                  className="h-12"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="h-12"
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                  className="h-12"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-semibold text-orange-600 hover:text-orange-800"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
