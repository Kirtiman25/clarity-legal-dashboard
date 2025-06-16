
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Task } from '@/services/adminTaskService';
import { useTaskForm } from './hooks/useTaskForm';
import { useUsers } from './hooks/useUsers';
import { TaskFormFields } from './components/TaskFormFields';
import { TaskFormSubmit } from './components/TaskFormSubmit';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
  onSuccess: () => void;
}

export const TaskForm = ({ isOpen, onClose, editingTask, onSuccess }: TaskFormProps) => {
  const { formData, setFormData } = useTaskForm({ editingTask, isOpen });
  const users = useUsers(isOpen, editingTask);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <TaskFormFields 
          formData={formData}
          setFormData={setFormData}
          users={users}
          editingTask={editingTask}
        />

        <TaskFormSubmit
          formData={formData}
          editingTask={editingTask}
          users={users}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
