export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time?: string;
  location?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  organizer_id: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'invited' | 'confirmed' | 'declined' | 'attended';
  created_at: string;
}

export interface Agenda {
  id: string;
  meeting_id: string;
  title: string;
  description?: string;
  order_index: number;
  duration_minutes?: number;
  presenter_id?: string;
  created_at: string;
}

export interface Minutes {
  id: string;
  meeting_id: string;
  content: string;
  decisions: string[];
  action_items: ActionItem[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  minutes_id: string;
  description: string;
  assigned_to: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  type: 'meeting' | 'agenda' | 'minutes';
  is_public: boolean;
  created_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'meeting_reminder' | 'action_item' | 'meeting_update' | 'system';
  read: boolean;
  created_at: string;
}