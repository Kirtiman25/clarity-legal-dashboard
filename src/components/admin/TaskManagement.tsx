
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { deleteTask, fetchAllTasks, type Task } from '@/services/adminTaskService';
import { TaskForm } from './tasks/TaskForm';
import { TaskTable } from './tasks/TaskTable';

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await fetchAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('TaskManagement: Deleting task', taskId);
      await deleteTask(taskId);
      
      // Immediately remove from local state for better UX
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Also reload from server to ensure consistency
      setTimeout(() => {
        loadTasks();
      }, 500);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Reload tasks in case of error to show current state
      loadTasks();
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
  };

  const closeEditDialog = () => {
    setEditingTask(null);
  };

  const handleTaskSuccess = () => {
    loadTasks();
    setIsCreateDialogOpen(false);
    closeEditDialog();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pt-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md shadow-md flex items-center gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found. Create your first task to get started.</p>
            </div>
          ) : (
            <TaskTable 
              tasks={tasks}
              onEdit={openEditDialog}
              onDelete={handleDeleteTask}
            />
          )}
        </CardContent>
      </Card>

      <TaskForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleTaskSuccess}
      />

      <TaskForm
        isOpen={!!editingTask}
        onClose={closeEditDialog}
        editingTask={editingTask}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
};

export default TaskManagement;
