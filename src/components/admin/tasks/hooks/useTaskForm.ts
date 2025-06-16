
import { useState, useEffect } from 'react';
import { type Task } from '@/services/adminTaskService';

interface TaskFormData {
  title: string;
  task_type: string;
  client_name: string;
  case_name: string;
  user_email: string;
  instructions: string;
}

interface UseTaskFormProps {
  editingTask?: Task | null;
  isOpen: boolean;
}

export const useTaskForm = ({ editingTask, isOpen }: UseTaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    task_type: 'submit_documents',
    client_name: 'ABC Corporation',
    case_name: 'Contract Review',
    user_email: 'john@example.com',
    instructions: 'Upload signed contract and ID proof'
  });

  // Reset form when opening for new task or load existing task data
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setFormData({
          title: editingTask.title || '',
          task_type: editingTask.task_type || 'submit_documents',
          client_name: editingTask.client_name || '',
          case_name: editingTask.case_name || '',
          user_email: '',
          instructions: editingTask.admin_note || ''
        });
      } else {
        // Reset to default values for new task
        setFormData({
          title: '',
          task_type: 'submit_documents',
          client_name: 'ABC Corporation',
          case_name: 'Contract Review',
          user_email: 'john@example.com',
          instructions: 'Upload signed contract and ID proof'
        });
      }
    }
  }, [isOpen, editingTask]);

  return {
    formData,
    setFormData
  };
};
