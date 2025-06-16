
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createTask, updateTask, type Task } from '@/services/adminTaskService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface TaskFormSubmitProps {
  formData: {
    title: string;
    task_type: string;
    client_name: string;
    case_name: string;
    user_email: string;
    instructions: string;
  };
  editingTask?: Task | null;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskFormSubmit = ({ formData, editingTask, users, onClose, onSuccess }: TaskFormSubmitProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (!editingTask && !formData.user_email) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let user_id = editingTask?.user_id;

      // If creating new task, find user ID from email
      if (!editingTask) {
        const selectedUser = users.find(u => u.email === formData.user_email);
        if (!selectedUser) {
          toast({
            title: "Error",
            description: "Selected user not found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        user_id = selectedUser.id;
      }

      const taskData = {
        title: formData.title,
        task_type: formData.task_type,
        client_name: formData.client_name || null,
        case_name: formData.case_name || null,
        admin_note: formData.instructions || null,
        user_id: user_id!
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} className="w-full" disabled={loading}>
      {loading ? 'Submitting...' : (editingTask ? 'Update Task' : 'Submit')}
    </Button>
  );
};
