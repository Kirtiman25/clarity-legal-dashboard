
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createTask, updateTask, type Task } from '@/services/adminTaskService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
  onSuccess: () => void;
}

interface User {
  id: string;
  email: string;
  full_name: string;
}

export const TaskForm = ({ isOpen, onClose, editingTask, onSuccess }: TaskFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
        loadUsers();
      }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <Label htmlFor="task-type">Task Type *</Label>
            <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submit_documents">Submit Documents</SelectItem>
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!editingTask && (
            <div>
              <Label htmlFor="user-email">User *</Label>
              <Select value={formData.user_email} onValueChange={(value) => setFormData({ ...formData, user_email: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="client-name">Client</Label>
            <Input
              id="client-name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="e.g., ABC Corporation"
            />
          </div>

          <div>
            <Label htmlFor="case-name">Case</Label>
            <Input
              id="case-name"
              value={formData.case_name}
              onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
              placeholder="e.g., Contract Review"
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., Upload signed contract and ID proof"
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : (editingTask ? 'Update Task' : 'Submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
