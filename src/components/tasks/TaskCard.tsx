
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Phone } from 'lucide-react';
import { type Task } from '@/services/taskService';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
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

  // Helper function to safely get string value
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`${getTaskColor(task.task_type)} p-2 rounded-lg`}>
              {getTaskIcon(task.task_type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{getStringValue(task.title)}</h3>
              <p className="text-sm text-gray-600">{getStringValue(task.case_name)}</p>
            </div>
          </div>
          <Badge variant={getTaskBadgeColor(task.task_type) as any}>
            {getStringValue(task.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
