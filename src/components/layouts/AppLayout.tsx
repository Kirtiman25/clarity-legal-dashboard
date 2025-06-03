
import React from 'react';
import { useAdminOverlay } from '@/hooks/useAdminOverlay';
import AdminOverlay from '@/components/admin/AdminOverlay';
import AdminFloatingButton from '@/components/admin/AdminFloatingButton';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isVisible, toggleOverlay, isAdmin } = useAdminOverlay();

  return (
    <div className="relative">
      {children}
      {isAdmin && (
        <>
          <AdminFloatingButton onClick={toggleOverlay} />
          <AdminOverlay isVisible={isVisible} onToggle={toggleOverlay} />
        </>
      )}
    </div>
  );
};

export default AppLayout;
