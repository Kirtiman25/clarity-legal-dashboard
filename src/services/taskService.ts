
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Task = Tables<'tasks'>;

export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    console.log('Fetching user tasks from database...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    console.log('Tasks fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserTasks:', error);
    toast({
      title: "Error",
      description: "Failed to fetch tasks",
      variant: "destructive",
    });
    return [];
  }
};

export const completeTask = async (taskId: string, updateData: Partial<Task>) => {
  try {
    console.log('Completing task:', taskId, updateData);
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updateData,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }

    console.log('Task completed successfully:', data);
    toast({
      title: "Success",
      description: "Task completed successfully",
    });

    return data;
  } catch (error) {
    console.error('Error in completeTask:', error);
    toast({
      title: "Error",
      description: "Failed to complete task",
      variant: "destructive",
    });
    throw error;
  }
};
