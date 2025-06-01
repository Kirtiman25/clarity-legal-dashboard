
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  referral_code: string;
  referred_by?: string;
  is_paid: boolean;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Task {
  id: string;
  user_id: string;
  task_type: 'pending_payment' | 'submit_documents' | 'follow_up' | 'court_hearing' | 'client_meeting' | 'document_review';
  title: string;
  client_name?: string;
  case_name?: string;
  invoice_amount?: string;
  documents?: any;
  admin_note?: string;
  last_update?: string;
  status: string;
  completed_at?: string;
  payment_info?: string;
  uploaded_documents?: string[];
  created_at: string;
}
