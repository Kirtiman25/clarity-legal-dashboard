
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAdminOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { userProfile } = useAuth();

  // Toggle overlay with keyboard shortcut (Ctrl/Cmd + Shift + A)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (userProfile?.role === 'admin' && 
          (event.ctrlKey || event.metaKey) && 
          event.shiftKey && 
          event.key === 'A') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userProfile]);

  const toggleOverlay = () => {
    if (userProfile?.role === 'admin') {
      setIsVisible(prev => !prev);
    }
  };

  return {
    isVisible,
    toggleOverlay,
    isAdmin: userProfile?.role === 'admin'
  };
};
