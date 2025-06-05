
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { createTask, updateTask, deleteTask, fetchAllTasks, type Task } from '@/services/adminTaskService';
import { fetchUserTasks } from '@/services/taskService';

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    task_type: 'pending_payment',
    client_name: '',
    case_name: '',
    invoice_amount: '',
    admin_note: '',
    user_id: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const allTasks = await fetchAllTasks();
    setTasks(allTasks);
    setLoading(false);
  };

  const handleCreateTask = async () => {
    if (!formData.title || !formData.user_id) {
      return;
    }

    try {
      await createTask(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        task_type: 'pending_payment',
        client_name: '',
        case_name: '',
        invoice_amount: '',
        admin_note: '',
        user_id: ''
      });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, formData);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      task_type: task.task_type,
      client_name: task.client_name || '',
      case_name: task.case_name || '',
      invoice_amount: task.invoice_amount || '',
      admin_note: task.admin_note || '',
      user_id: task.user_id
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'destructive',
      completed: 'default',
      in_progress: 'secondary'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
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

              <div>
                <Label htmlFor="admin-note">Admin Note</Label>
                <Textarea
                  id="admin-note"
                  value={formData.admin_note}
                  onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })}
                  placeholder="Enter admin note"
                />
              </div>

              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-admin-note">Admin Note</Label>
              <Textarea
                id="edit-admin-note"
                value={formData.admin_note}
                onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })}
              />
            </div>

            <Button onClick={handleUpdateTask} className="w-full">
              Update Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
