
import { CheckSquare, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { type Task } from '@/services/taskService';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onCompleteTask: (taskId: string, updateData: any) => Promise<void>;
}

const TaskList = ({ tasks, loading, onCompleteTask }: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.case_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.task_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">No tasks available</h3>
        <p className="text-gray-500">Tasks will appear here when they are assigned to you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Task Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="submit_documents">Submit Documents</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskDetailModal 
              key={task.id} 
              task={task} 
              onCompleteTask={onCompleteTask}
            >
              <TaskCard task={task} onClick={() => {}} />
            </TaskDetailModal>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
