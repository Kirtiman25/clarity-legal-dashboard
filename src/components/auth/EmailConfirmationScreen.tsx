
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EmailConfirmationScreenProps {
  userEmail: string;
  onBackToSignIn: () => void;
}

const EmailConfirmationScreen = ({ userEmail, onBackToSignIn }: EmailConfirmationScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/bf6a79a0-729c-4263-ac44-d1f2cda8c9cb.png" 
              alt="Clar Catalyst Logo" 
              className="h-32 w-auto"
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
              Please check your email ({userEmail}) and click the confirmation link to complete your registration.
              Once confirmed, you can sign in to access your account.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={onBackToSignIn}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmationScreen;
