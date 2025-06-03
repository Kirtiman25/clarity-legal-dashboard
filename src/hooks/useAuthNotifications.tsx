
import { toast } from '@/hooks/use-toast';

export const useAuthNotifications = () => {
  const showWelcomeToast = () => {
    toast({
      title: "Welcome!",
      description: "You have been signed in successfully.",
    });
  };

  return {
    showWelcomeToast
  };
};
