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
          role: 'student' | 'instructor' | 'admin';
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
          role?: 'student' | 'instructor' | 'admin';
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
          role?: 'student' | 'instructor' | 'admin';
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
