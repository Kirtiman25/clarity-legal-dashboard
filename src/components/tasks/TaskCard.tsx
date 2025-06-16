
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Phone, Calendar, DollarSign } from 'lucide-react';
import { type Task } from '@/services/taskService';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return <DollarSign className="h-5 w-5 text-white" />;
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
        return 'outline';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  // Helper function to safely get string value
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${getTaskColor(task.task_type)} p-3 rounded-lg shadow-lg`}>
              {getTaskIcon(task.task_type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{getStringValue(task.title)}</h3>
              <p className="text-sm text-gray-600">{getStringValue(task.case_name)}</p>
              {task.client_name && (
                <p className="text-xs text-gray-500">Client: {getStringValue(task.client_name)}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={getStatusBadgeColor(task.status) as any}>
              {getStringValue(task.status).toUpperCase()}
            </Badge>
            <Badge variant={getTaskBadgeColor(task.task_type) as any}>
              {getStringValue(task.task_type).replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(task.created_at)}</span>
          </div>
          {task.invoice_amount && task.task_type === 'pending_payment' && (
            <div className="text-green-600 font-semibold">
              {getStringValue(task.invoice_amount)}
            </div>
          )}
        </div>

        {task.admin_note && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> {getStringValue(task.admin_note)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
