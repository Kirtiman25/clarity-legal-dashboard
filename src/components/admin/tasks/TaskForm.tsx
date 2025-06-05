
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createTask, updateTask, type Task } from '@/services/adminTaskService';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
  onSuccess: () => void;
}

export const TaskForm = ({ isOpen, onClose, editingTask, onSuccess }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    task_type: editingTask?.task_type || 'pending_payment',
    client_name: editingTask?.client_name || '',
    case_name: editingTask?.case_name || '',
    invoice_amount: editingTask?.invoice_amount || '',
    admin_note: editingTask?.admin_note || '',
    user_id: editingTask?.user_id || ''
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.user_id) {
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      
      onClose();
      setFormData({
        title: '',
        task_type: 'pending_payment',
        client_name: '',
        case_name: '',
        invoice_amount: '',
        admin_note: '',
        user_id: ''
      });
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>
          
          {!editingTask && (
            <>
              <div>
                <Label htmlFor="task-type">Task Type</Label>
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
                <Label htmlFor="user-id">User ID</Label>
                <Input
                  id="user-id"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  placeholder="Enter user ID"
                />
              </div>

              <div>
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <Label htmlFor="case-name">Case Name</Label>
                <Input
                  id="case-name"
                  value={formData.case_name}
                  onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
                  placeholder="Enter case name"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="admin-note">Admin Note</Label>
            <Textarea
              id="admin-note"
              value={formData.admin_note}
              onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })}
              placeholder="Enter admin note"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
