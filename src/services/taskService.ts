
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  user_id: string;
  task_type: 'pending_payment' | 'submit_documents' | 'follow_up' | 'court_hearing' | 'client_meeting' | 'document_review';
  title: string;
  client_name?: string;
  case_name?: string;
  invoice_amount?: string;
  documents?: any;
  admin_note?: string;
  last_update?: string;
  status: string;
  completed_at?: string;
  payment_info?: string;
  uploaded_documents?: string[];
  created_at: string;
}

export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    console.log('Fetching user tasks from database...');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
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
