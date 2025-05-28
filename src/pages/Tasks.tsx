
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, FileText, Phone, CheckSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      type: 'pending_payment',
      title: 'Pending Payment from Client',
      clientName: 'ABC Enterprises',
      caseName: 'Debt Recovery Case #123',
      invoiceAmount: '₹50,000',
      status: 'pending'
    },
    {
      id: 2,
      type: 'submit_documents',
      title: 'Submit Documents',
      clientName: 'XYZ Corp',
      caseName: 'Legal Notice Case #456',
      documents: ['Affidavit', 'Property Papers', 'Identity Proof'],
      status: 'pending'
    },
    {
      id: 3,
      type: 'follow_up',
      title: 'Take Follow-Up',
      caseName: 'Cheque Bounce Case #789',
      lastUpdate: '2024-01-15',
      adminNote: 'Contact client for status update on payment',
      status: 'pending'
    }
  ]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return <AlertCircle className="h-5 w-5" />;
      case 'submit_documents':
        return <FileText className="h-5 w-5" />;
      case 'follow_up':
        return <Phone className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
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

  const TaskDetailModal = ({ task }: { task: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`${getTaskColor(task.type)} p-2 rounded-lg`}>
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.caseName}</p>
                </div>
              </div>
              <Badge variant={getTaskBadgeColor(task.type)}>
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
          {task.type === 'pending_payment' && (
            <>
              <div>
                <Label>Client Name</Label>
                <p className="font-semibold">{task.clientName}</p>
              </div>
              <div>
                <Label>Case Name</Label>
                <p className="font-semibold">{task.caseName}</p>
              </div>
              <div>
                <Label>Invoice Amount</Label>
                <p className="font-semibold text-green-600">{task.invoiceAmount}</p>
              </div>
              <div>
                <Label htmlFor="payment-info">Payment Information</Label>
                <Input id="payment-info" placeholder="Enter payment details" />
              </div>
            </>
          )}
          
          {task.type === 'submit_documents' && (
            <>
              <div>
                <Label>Client Name</Label>
                <p className="font-semibold">{task.clientName}</p>
              </div>
              <div>
                <Label>Case Name</Label>
                <p className="font-semibold">{task.caseName}</p>
              </div>
              <div>
                <Label>Required Documents</Label>
                <ul className="list-disc list-inside space-y-1">
                  {task.documents?.map((doc: string, index: number) => (
                    <li key={index} className="text-sm">{doc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label htmlFor="document-upload">Upload Documents (PDF)</Label>
                <Input id="document-upload" type="file" accept=".pdf" />
              </div>
            </>
          )}
          
          {task.type === 'follow_up' && (
            <>
              <div>
                <Label>Case Name</Label>
                <p className="font-semibold">{task.caseName}</p>
              </div>
              <div>
                <Label>Last Update</Label>
                <p className="font-semibold">{task.lastUpdate}</p>
              </div>
              <div>
                <Label>Admin Note</Label>
                <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {task.adminNote}
                </p>
              </div>
            </>
          )}
          
          <Button className="w-full">Complete Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
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
  );
};

export default Tasks;
