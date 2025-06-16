
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
}

export const useUsers = (isOpen: boolean, editingTask?: any) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen && !editingTask) {
      loadUsers();
    }
  }, [isOpen, editingTask]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('role', 'user')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  return users;
};
