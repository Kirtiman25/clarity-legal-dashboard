
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type Task } from '@/services/taskService';

interface TaskDetailModalProps {
  task: Task;
  children: React.ReactNode;
  onCompleteTask: (taskId: string, updateData: any) => Promise<void>;
}

const TaskDetailModal = ({ task, children, onCompleteTask }: TaskDetailModalProps) => {
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

    await onCompleteTask(task.id, updateData);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getStringValue(task.title)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {task.task_type === 'pending_payment' && (
            <>
              {task.client_name && (
                <div>
                  <Label>Client Name</Label>
                  <p className="font-semibold">{getStringValue(task.client_name)}</p>
                </div>
              )}
              {task.case_name && (
                <div>
                  <Label>Case Name</Label>
                  <p className="font-semibold">{getStringValue(task.case_name)}</p>
                </div>
              )}
              {task.invoice_amount && (
                <div>
                  <Label>Invoice Amount</Label>
                  <p className="font-semibold text-green-600">{getStringValue(task.invoice_amount)}</p>
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
                  <p className="font-semibold">{getStringValue(task.client_name)}</p>
                </div>
              )}
              {task.case_name && (
                <div>
                  <Label>Case Name</Label>
                  <p className="font-semibold">{getStringValue(task.case_name)}</p>
                </div>
              )}
              {task.documents && (
                <div>
                  <Label>Required Documents</Label>
                  <ul className="list-disc list-inside space-y-1">
                    {getDocumentsList(task.documents).map((doc: string, index: number) => (
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
                  <p className="font-semibold">{getStringValue(task.case_name)}</p>
                </div>
              )}
              {task.last_update && (
                <div>
                  <Label>Last Update</Label>
                  <p className="font-semibold">{getStringValue(task.last_update)}</p>
                </div>
              )}
              {task.admin_note && (
                <div>
                  <Label>Admin Note</Label>
                  <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {getStringValue(task.admin_note)}
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

export default TaskDetailModal;
