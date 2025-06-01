
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, FileText, Phone, CheckSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchUserTasks, completeTask, type Task } from '@/services/taskService';
import { useAuth } from '@/hooks/useAuth';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await fetchUserTasks();
      setTasks(userTasks.filter(task => task.status === 'pending'));
    } catch (error) {
      console.error('Error loading tasks:', error);
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

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return <AlertCircle className="h-5 w-5 text-white" />;
      case 'submit_documents':
        return <FileText className="h-5 w-5 text-white" />;
      case 'follow_up':
        return <Phone className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return 'bg-red-500';
      case 'submit_documents':
        return 'bg-blue-500';
      case 'follow_up':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskBadgeColor = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return 'destructive';
      case 'submit_documents':
        return 'default';
      case 'follow_up':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const TaskDetailModal = ({ task }: { task: Task }) => {
    const [paymentInfo, setPaymentInfo] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleTaskSubmit = async () => {
      const updateData: any = {};
      
      if (task.task_type === 'pending_payment' && paymentInfo) {
        updateData.payment_info = paymentInfo;
      }
      
      if (task.task_type === 'submit_documents' && uploadedFile) {
        // In a real app, you'd upload the file to storage first
        updateData.uploaded_documents = [uploadedFile.name];
      }

      await handleCompleteTask(task.id, updateData);
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`${getTaskColor(task.task_type)} p-2 rounded-lg`}>
                    {getTaskIcon(task.task_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.case_name}</p>
                  </div>
                </div>
                <Badge variant={getTaskBadgeColor(task.task_type)}>
                  {task.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {task.task_type === 'pending_payment' && (
              <>
                {task.client_name && (
                  <div>
                    <Label>Client Name</Label>
                    <p className="font-semibold">{task.client_name}</p>
                  </div>
                )}
                {task.case_name && (
                  <div>
                    <Label>Case Name</Label>
                    <p className="font-semibold">{task.case_name}</p>
                  </div>
                )}
                {task.invoice_amount && (
                  <div>
                    <Label>Invoice Amount</Label>
                    <p className="font-semibold text-green-600">{task.invoice_amount}</p>
                  </div>
                )}
                <div>
                  <Label htmlFor="payment-info">Payment Information</Label>
                  <Input 
                    id="payment-info" 
                    placeholder="Enter payment details"
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                  />
                </div>
              </>
            )}
            
            {task.task_type === 'submit_documents' && (
              <>
                {task.client_name && (
                  <div>
                    <Label>Client Name</Label>
                    <p className="font-semibold">{task.client_name}</p>
                  </div>
                )}
                {task.case_name && (
                  <div>
                    <Label>Case Name</Label>
                    <p className="font-semibold">{task.case_name}</p>
                  </div>
                )}
                {task.documents && (
                  <div>
                    <Label>Required Documents</Label>
                    <ul className="list-disc list-inside space-y-1">
                      {JSON.parse(task.documents).map((doc: string, index: number) => (
                        <li key={index} className="text-sm">{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <Label htmlFor="document-upload">Upload Documents (PDF)</Label>
                  <Input 
                    id="document-upload" 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  />
                </div>
              </>
            )}
            
            {task.task_type === 'follow_up' && (
              <>
                {task.case_name && (
                  <div>
                    <Label>Case Name</Label>
                    <p className="font-semibold">{task.case_name}</p>
                  </div>
                )}
                {task.last_update && (
                  <div>
                    <Label>Last Update</Label>
                    <p className="font-semibold">{task.last_update}</p>
                  </div>
                )}
                {task.admin_note && (
                  <div>
                    <Label>Admin Note</Label>
                    <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {task.admin_note}
                    </p>
                  </div>
                )}
              </>
            )}
            
            <Button className="w-full" onClick={handleTaskSubmit}>
              Complete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header title="Tasks" />
          <div className="container mx-auto px-4 pt-20 pb-24">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
          <Navigation />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header title="Tasks" />
        
        <div className="container mx-auto px-4 pt-20 pb-24">
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskDetailModal key={task.id} task={task} />
            ))}
          </div>
          
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No tasks available</h3>
              <p className="text-gray-500">All your tasks are completed!</p>
            </div>
          )}
        </div>

        <Navigation />
      </div>
    </ProtectedRoute>
  );
};

export default Tasks;
