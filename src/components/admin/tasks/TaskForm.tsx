
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
    title: editingTask?.title || '',
    task_type: editingTask?.task_type || 'pending_payment',
    client_name: editingTask?.client_name || '',
    case_name: editingTask?.case_name || '',
    invoice_amount: editingTask?.invoice_amount || '',
    instructions: editingTask?.admin_note || '',
    user_email: ''
  });

  // Load users when component mounts
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
        invoice_amount: formData.invoice_amount || null,
        admin_note: formData.instructions || null,
        user_id: user_id!
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      
      onClose();
      setFormData({
        title: '',
        task_type: 'pending_payment',
        client_name: '',
        case_name: '',
        invoice_amount: '',
        instructions: '',
        user_email: ''
      });
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
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
              placeholder="e.g., Submit signed contract documents"
            />
          </div>
          
          {!editingTask && (
            <>
              <div>
                <Label htmlFor="task-type">Task Type *</Label>
                <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                    <SelectItem value="submit_documents">Submit Documents</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-email">Assign to User *</Label>
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

              <div>
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g., ABC Corporation"
                />
              </div>

              <div>
                <Label htmlFor="case-name">Case Name</Label>
                <Input
                  id="case-name"
                  value={formData.case_name}
                  onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
                  placeholder="e.g., Contract Review"
                />
              </div>

              {formData.task_type === 'pending_payment' && (
                <div>
                  <Label htmlFor="invoice-amount">Invoice Amount (₹)</Label>
                  <Input
                    id="invoice-amount"
                    value={formData.invoice_amount}
                    onChange={(e) => setFormData({ ...formData, invoice_amount: e.target.value })}
                    placeholder="e.g., 50000"
                    type="number"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="instructions">Instructions for User</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., Upload signed contract and ID proof. Ensure all pages are clearly visible."
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Creating...' : (editingTask ? 'Update Task' : 'Create Task')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
