export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          avatar_url: string | null;
          role: 'cadastrado' | 'student' | 'instructor' | 'admin';
          subscription_status: 'active' | 'inactive' | 'trial' | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'cadastrado' | 'student' | 'instructor' | 'admin';
          subscription_status?: 'active' | 'inactive' | 'trial' | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'cadastrado' | 'student' | 'instructor' | 'admin';
          subscription_status?: 'active' | 'inactive' | 'trial' | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          type: 'ebook' | 'course' | 'subscription';
          title: string;
          description: string | null;
          price: number;
          featured_image: string | null;
          content_url: string | null;
          status: 'draft' | 'published';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'ebook' | 'course' | 'subscription';
          title: string;
          description?: string | null;
          price: number;
          featured_image?: string | null;
          content_url?: string | null;
          status?: 'draft' | 'published';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'ebook' | 'course' | 'subscription';
          title?: string;
          description?: string | null;
          price?: number;
          featured_image?: string | null;
          content_url?: string | null;
          status?: 'draft' | 'published';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          product_id: string;
          modules: Json | null;
          duration: number | null;
          level: 'beginner' | 'intermediate' | 'advanced' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          modules?: Json | null;
          duration?: number | null;
          level?: 'beginner' | 'intermediate' | 'advanced' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          modules?: Json | null;
          duration?: number | null;
          level?: 'beginner' | 'intermediate' | 'advanced' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          amount: number;
          status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method: string | null;
          asaas_payment_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          amount: number;
          status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          asaas_payment_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          amount?: number;
          status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          asaas_payment_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          source: string | null;
          tags: string[] | null;
          status: 'new' | 'contacted' | 'converted' | 'lost';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          source?: string | null;
          tags?: string[] | null;
          status?: 'new' | 'contacted' | 'converted' | 'lost';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          source?: string | null;
          tags?: string[] | null;
          status?: 'new' | 'contacted' | 'converted' | 'lost';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          category_id: string;
          statement: string;
          options: Json;
          explanation: string;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          statement: string;
          options: Json;
          explanation: string;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          statement?: string;
          options?: Json;
          explanation?: string;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_sets: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          status: 'draft' | 'published';
          time_limit_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          status?: 'draft' | 'published';
          time_limit_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          status?: 'draft' | 'published';
          time_limit_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_set_questions: {
        Row: {
          quiz_set_id: string;
          question_id: string;
          position: number;
        };
        Insert: {
          quiz_set_id: string;
          question_id: string;
          position?: number;
        };
        Update: {
          quiz_set_id?: string;
          question_id?: string;
          position?: number;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_set_id: string;
          started_at: string;
          finished_at: string | null;
          score: number;
          total: number;
          answers_snapshot: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_set_id: string;
          started_at?: string;
          finished_at?: string | null;
          score?: number;
          total: number;
          answers_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_set_id?: string;
          started_at?: string;
          finished_at?: string | null;
          score?: number;
          total?: number;
          answers_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
