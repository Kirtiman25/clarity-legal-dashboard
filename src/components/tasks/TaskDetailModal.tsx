
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, Phone, User } from 'lucide-react';
import { type Task } from '@/services/taskService';

interface TaskDetailModalProps {
  task: Task;
  children: React.ReactNode;
  onCompleteTask: (taskId: string, updateData: any) => Promise<void>;
}

const TaskDetailModal = ({ task, children, onCompleteTask }: TaskDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleTaskSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updateData: any = {};
      
      if (task.task_type === 'pending_payment' && paymentInfo) {
        updateData.payment_info = paymentInfo;
      }
      
      if (task.task_type === 'follow_up' && followUpNotes) {
        updateData.admin_note = followUpNotes;
      }
      
      if (task.task_type === 'submit_documents' && uploadedFile) {
        // In a real app, you'd upload the file to storage first
        updateData.uploaded_documents = [uploadedFile.name];
      }

      await onCompleteTask(task.id, updateData);
      setIsOpen(false);
      // Reset form
      setPaymentInfo('');
      setFollowUpNotes('');
      setUploadedFile(null);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely parse documents
  const getDocumentsList = (documents: any): string[] => {
    if (!documents) return [];
    if (typeof documents === 'string') {
      try {
        return JSON.parse(documents);
      } catch {
        return [];
      }
    }
    if (Array.isArray(documents)) {
      return documents.filter(doc => typeof doc === 'string');
    }
    return [];
  };

  // Helper function to safely get string value
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return <DollarSign className="h-5 w-5" />;
      case 'submit_documents':
        return <FileText className="h-5 w-5" />;
      case 'follow_up':
        return <Phone className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const isTaskCompleted = task.status === 'completed';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTaskIcon(task.task_type)}
            <span>{getStringValue(task.title)}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Overview */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {getStringValue(task.task_type).replace('_', ' ')}
              </Badge>
              <Badge variant={task.status === 'completed' ? 'default' : 'destructive'}>
                {getStringValue(task.status).toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(task.created_at)}</span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            {task.client_name && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium">Client Name</Label>
                  <p className="font-semibold">{getStringValue(task.client_name)}</p>
                </div>
              </div>
            )}
            
            {task.case_name && (
              <div>
                <Label className="text-sm font-medium">Case Name</Label>
                <p className="font-semibold">{getStringValue(task.case_name)}</p>
              </div>
            )}
          </div>

          {/* Task-specific content */}
          {task.task_type === 'pending_payment' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-lg">Payment Information</h4>
              {task.invoice_amount && (
                <div>
                  <Label className="text-sm font-medium">Invoice Amount</Label>
                  <p className="text-2xl font-bold text-green-600">₹{getStringValue(task.invoice_amount)}</p>
                </div>
              )}
              {!isTaskCompleted && (
                <div>
                  <Label htmlFor="payment-info">Payment Details</Label>
                  <Textarea 
                    id="payment-info" 
                    placeholder="Enter payment reference number, transaction ID, or other payment details..."
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              {task.payment_info && (
                <div>
                  <Label className="text-sm font-medium">Submitted Payment Info</Label>
                  <p className="p-2 bg-green-50 border border-green-200 rounded">{getStringValue(task.payment_info)}</p>
                </div>
              )}
            </div>
          )}
          
          {task.task_type === 'submit_documents' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-lg">Document Submission</h4>
              {task.documents && (
                <div>
                  <Label className="text-sm font-medium">Required Documents</Label>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {getDocumentsList(task.documents).map((doc: string, index: number) => (
                      <li key={index} className="text-sm bg-blue-50 p-2 rounded">{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!isTaskCompleted && (
                <div>
                  <Label htmlFor="document-upload">Upload Documents (PDF, JPG, PNG)</Label>
                  <Input 
                    id="document-upload" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                </div>
              )}
              {task.uploaded_documents && task.uploaded_documents.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Uploaded Documents</Label>
                  <ul className="space-y-1 mt-2">
                    {task.uploaded_documents.map((doc: string, index: number) => (
                      <li key={index} className="text-sm bg-green-50 p-2 rounded border border-green-200">{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {task.task_type === 'follow_up' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-lg">Follow-up Information</h4>
              {task.last_update && (
                <div>
                  <Label className="text-sm font-medium">Last Update</Label>
                  <p className="font-semibold">{formatDate(task.last_update)}</p>
                </div>
              )}
              {!isTaskCompleted && (
                <div>
                  <Label htmlFor="follow-up-notes">Follow-up Notes</Label>
                  <Textarea 
                    id="follow-up-notes" 
                    placeholder="Enter your follow-up notes or updates..."
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

          {/* Admin Note */}
          {task.admin_note && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Label className="text-sm font-medium">Admin Note</Label>
              <p className="text-sm text-yellow-800 mt-1">{getStringValue(task.admin_note)}</p>
            </div>
          )}

          {/* Completion Status */}
          {isTaskCompleted && task.completed_at && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <Label className="text-sm font-medium">Task Completed</Label>
              <p className="text-sm text-green-800 mt-1">
                Completed on {formatDate(task.completed_at)}
              </p>
            </div>
          )}
          
          {/* Action Button */}
          {!isTaskCompleted && (
            <Button 
              className="w-full" 
              onClick={handleTaskSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Completing Task...' : 'Complete Task'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
