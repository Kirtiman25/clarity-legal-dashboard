
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TaskActions } from './TaskActions';
import { type Task } from '@/services/adminTaskService';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'destructive',
      completed: 'default',
      in_progress: 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.task_type}</TableCell>
            <TableCell>{getStatusBadge(task.status)}</TableCell>
            <TableCell>{task.client_name || 'N/A'}</TableCell>
            <TableCell>
              <TaskActions 
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
