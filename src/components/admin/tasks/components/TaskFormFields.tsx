
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface TaskFormFieldsProps {
  formData: {
    title: string;
    task_type: string;
    client_name: string;
    case_name: string;
    user_email: string;
    instructions: string;
  };
  setFormData: (data: any) => void;
  users: User[];
  editingTask?: any;
}

export const TaskFormFields = ({ formData, setFormData, users, editingTask }: TaskFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
        />
      </div>
      
      <div>
        <Label htmlFor="task-type">Task Type *</Label>
        <Select value={formData.task_type} onValueChange={(value) => setFormData({ ...formData, task_type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submit_documents">Submit Documents</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!editingTask && (
        <div>
          <Label htmlFor="user-email">User *</Label>
          <Select value={formData.user_email} onValueChange={(value) => setFormData({ ...formData, user_email: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select user..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.email}>
                  {user.full_name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="client-name">Client</Label>
        <Input
          id="client-name"
          value={formData.client_name}
          onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          placeholder="Enter your company"
        />
      </div>

      <div>
        <Label htmlFor="case-name">Case</Label>
        <Input
          id="case-name"
          value={formData.case_name}
          onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
          placeholder="e.g., Contract Review"
        />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="e.g., Upload signed contract and ID proof"
          rows={3}
        />
      </div>
    </div>
  );
};
