
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { type Task } from '@/services/adminTaskService';

interface TaskActionsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskActions = ({ task, onEdit, onDelete }: TaskActionsProps) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
        <Edit className="h-3 w-3" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleDelete}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
