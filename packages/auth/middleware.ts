import { supabase } from '@reeduca/database';

export type UserRole = 'cadastrado' | 'student' | 'instructor' | 'admin';

export const authMiddleware = {
  // Check if user is authenticated
  async requireAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Unauthorized');
    }

    return session;
  },

  // Check if user has specific role
  async requireRole(requiredRole: UserRole | UserRole[]) {
    const session = await this.requireAuth();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!roles.includes(profile.role as UserRole)) {
      throw new Error('Forbidden: Insufficient permissions');
    }

    return { session, profile };
  },

  // Check if user owns a resource
  async requireOwnership(userId: string) {
    const session = await this.requireAuth();

    if (session.user.id !== userId) {
      throw new Error('Forbidden: Not the owner');
    }

    return session;
  },

  // Check if user is admin
  async requireAdmin() {
    return this.requireRole('admin');
  },
};
