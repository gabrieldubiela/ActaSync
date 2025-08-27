import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          start_time: string;
          end_time: string | null;
          location: string | null;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          organizer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          start_time: string;
          end_time?: string | null;
          location?: string | null;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          organizer_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          start_time?: string;
          end_time?: string | null;
          location?: string | null;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          organizer_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};