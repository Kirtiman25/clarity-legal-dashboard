
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Task = Tables<'tasks'>;

export const createTask = async (taskData: Partial<Task>) => {
  try {
    // Ensure required fields are present
    if (!taskData.title || !taskData.user_id || !taskData.task_type) {
      throw new Error('Title, user_id, and task_type are required');
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        task_type: taskData.task_type,
        user_id: taskData.user_id,
        status: 'pending',
        admin_note: taskData.admin_note || null,
        case_name: taskData.case_name || null,
        client_name: taskData.client_name || null,
        invoice_amount: taskData.invoice_amount || null,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Task created successfully",
    });

    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    toast({
      title: "Error",
      description: "Failed to create task",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Task updated successfully",
    });

    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      title: "Error",
      description: "Failed to update task",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      title: "Error",
      description: "Failed to delete task",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchAllTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    toast({
      title: "Error",
      description: "Failed to fetch tasks",
      variant: "destructive",
    });
    return [];
  }
};
