export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          weekly_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          weekly_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          weekly_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'A' | 'B' | 'C';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'A' | 'B' | 'C';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'A' | 'B' | 'C';
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          workout_id: string;
          name: string;
          sets: number;
          reps: string;
          rest_time: number;
          video_url: string | null;
          image_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          name: string;
          sets: number;
          reps: string;
          rest_time: number;
          video_url?: string | null;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          name?: string;
          sets?: number;
          reps?: string;
          rest_time?: number;
          video_url?: string | null;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          date: string;
          duration: number;
          completed: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          date?: string;
          duration?: number;
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          date?: string;
          duration?: number;
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      session_exercises: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string;
          completed: boolean;
          weight: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_id: string;
          completed?: boolean;
          weight?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          exercise_id?: string;
          completed?: boolean;
          weight?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      session_photos: {
        Row: {
          id: string;
          session_id: string;
          photo_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          photo_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          photo_url?: string;
          created_at?: string;
        };
      };
    };
  };
}