
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSessionOperations = () => {
  const getSessionWithRetry = async (maxRetries: number = 3): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
      } catch (error) {
        console.warn(`Session fetch attempt ${i + 1} failed:`, error);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };

  const handleConnectionError = () => {
    toast({
      title: "Connection Issue",
      description: "Having trouble connecting. Please refresh the page.",
      variant: "destructive",
      duration: 8000,
    });
  };

  return {
    getSessionWithRetry,
    handleConnectionError
  };
};
