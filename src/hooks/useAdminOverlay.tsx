
import { useState, useEffect } from 'react';
import { useAuth } from './useSimpleAuth';

export const useAdminOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAdmin } = useAuth();

  // Toggle overlay with keyboard shortcut (Ctrl/Cmd + Shift + A)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAdmin && 
          (event.ctrlKey || event.metaKey) && 
          event.shiftKey && 
          event.key === 'A') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin]);

  const toggleOverlay = () => {
    if (isAdmin) {
      setIsVisible(prev => !prev);
    }
  };

  return {
    isVisible,
    toggleOverlay,
    isAdmin
  };
};
