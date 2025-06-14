
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Shield, Eye, Database, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useSimpleAuth';
import { useNavigate } from 'react-router-dom';

interface AdminOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

const AdminOverlay = ({ isVisible, onToggle }: AdminOverlayProps) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return null;
  }

  const adminActions = [
    {
      title: 'User Management',
      description: 'View and manage all users',
      icon: Users,
      color: 'bg-blue-500',
      action: () => navigate('/admin/users')
    },
    {
      title: 'System Monitor',
      description: 'Monitor system activity',
      icon: Activity,
      color: 'bg-green-500',
      action: () => navigate('/admin/monitor')
    },
    {
      title: 'Database Admin',
      description: 'Manage database operations',
      icon: Database,
      color: 'bg-purple-500',
      action: () => navigate('/admin/database')
    },
    {
      title: 'User View Mode',
      description: 'Experience app as regular user',
      icon: Eye,
      color: 'bg-orange-500',
      action: () => navigate('/workspace')
    }
  ];

  return (
    <Sheet open={isVisible} onOpenChange={onToggle}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <SheetTitle>Admin Control Panel</SheetTitle>
            <Badge variant="destructive">ADMIN</Badge>
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Active Users: <span className="font-bold">24</span></div>
                <div>Pending Tasks: <span className="font-bold">12</span></div>
                <div>System Status: <span className="text-green-600 font-bold">Healthy</span></div>
                <div>DB Queries: <span className="font-bold">1.2k/min</span></div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Admin Actions</h3>
            {adminActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={action.action}
              >
                <div className={`${action.color} p-2 rounded mr-3`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Admin Mode Active
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                You have elevated privileges. Use responsibly.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminOverlay;
