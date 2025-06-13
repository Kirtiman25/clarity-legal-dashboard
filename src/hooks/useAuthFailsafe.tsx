
import { useEffect } from 'react';

interface UseAuthFailsafeProps {
  initialized: boolean;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  timeoutMs?: number;
}

export function useAuthFailsafe({ 
  initialized, 
  setLoading, 
  setInitialized, 
  timeoutMs = 5000 
}: UseAuthFailsafeProps) {
  useEffect(() => {
    const failsafe = setTimeout(() => {
      if (!initialized) {
        console.log('Auth initialization failsafe triggered');
        setLoading(false);
        setInitialized(true);
      }
    }, timeoutMs);

    return () => clearTimeout(failsafe);
  }, [initialized, setLoading, setInitialized, timeoutMs]);
}
