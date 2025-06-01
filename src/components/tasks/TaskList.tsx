
import { CheckSquare } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { type Task } from '@/services/taskService';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onCompleteTask: (taskId: string, updateData: any) => Promise<void>;
}

const TaskList = ({ tasks, loading, onCompleteTask }: TaskListProps) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">No tasks available</h3>
        <p className="text-gray-500">All your tasks are completed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskDetailModal 
          key={task.id} 
          task={task} 
          onCompleteTask={onCompleteTask}
        >
          <TaskCard task={task} onClick={() => {}} />
        </TaskDetailModal>
      ))}
    </div>
  );
};

export default TaskList;
