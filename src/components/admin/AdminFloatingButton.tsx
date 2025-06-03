
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminFloatingButtonProps {
  onClick: () => void;
}

const AdminFloatingButton = ({ onClick }: AdminFloatingButtonProps) => {
  const { userProfile } = useAuth();

  if (!userProfile || userProfile.role !== 'admin') {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg"
      size="sm"
    >
      <Shield className="h-4 w-4" />
      <span className="sr-only">Admin Panel</span>
    </Button>
  );
};

export default AdminFloatingButton;
