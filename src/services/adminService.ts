
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type User = Tables<'users'>;

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: "Success",
      description: `User role updated to ${role}`,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    toast({
      title: "Error",
      description: "Failed to update user role",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchSystemStats = async () => {
  try {
    // Fetch multiple stats in parallel
    const [usersResult, tasksResult, earningsResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('earnings').select('amount')
    ]);

    const totalEarnings = earningsResult.data?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;

    return {
      totalUsers: usersResult.count || 0,
      totalTasks: tasksResult.count || 0,
      totalEarnings,
      activeUsers: usersResult.count || 0 // Simplified for now
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      totalUsers: 0,
      totalTasks: 0,
      totalEarnings: 0,
      activeUsers: 0
    };
  }
};
