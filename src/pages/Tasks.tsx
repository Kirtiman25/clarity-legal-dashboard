
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskList from '@/components/tasks/TaskList';
import { fetchUserTasks, completeTask, type Task } from '@/services/taskService';
import { useAuth } from '@/hooks/useSimpleAuth';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Always show the page content immediately
    setLoading(false);
    
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      console.log('Starting to load tasks...');
      setLoading(true);
      const userTasks = await fetchUserTasks();
      console.log('Loaded tasks:', userTasks);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Don't keep loading state on error
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string, updateData: any) => {
    try {
      await completeTask(taskId, updateData);
      // Reload tasks to update the list
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="My Tasks" />
        
        <div className="container mx-auto px-4 pt-24 pb-24">
          <TaskList 
            tasks={tasks}
            loading={loading}
            onCompleteTask={handleCompleteTask}
          />
        </div>

        <Navigation />
      </div>
    </ProtectedRoute>
  );
};

export default Tasks;
