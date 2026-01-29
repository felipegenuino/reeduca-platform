import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  role: 'student' | 'instructor' | 'admin';
  subscription_status: 'active' | 'inactive' | 'trial' | null;
  created_at: string;
  updated_at: string;
};

export type CurrentUser = {
  user: User;
  profile: Profile;
};

/**
 * Retorna o usuário autenticado e o perfil (profiles) no servidor.
 * Use em Server Components e Server Actions para dados seguros.
 * Retorna null se não houver sessão válida.
 *
 * O perfil é criado automaticamente no signup (trigger handle_new_user).
 * Produtos/serviços do usuário vêm de:
 * - enrollments (cursos em que está matriculado)
 * - purchases (compras — produtos adquiridos)
 * - profiles.role e profiles.subscription_status
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, user_id, name, avatar_url, role, subscription_status, created_at, updated_at')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) return null;

  return {
    user,
    profile: profile as Profile,
  };
}

/**
 * Exige usuário autenticado. Redireciona para /login se não houver sessão.
 * Use em layouts ou páginas que devem ser protegidas no servidor também.
 */
export async function requireCurrentUser(): Promise<CurrentUser> {
  const current = await getCurrentUser();
  if (!current) {
    const { redirect } = await import('next/navigation');
    redirect('/login?redirectTo=' + encodeURIComponent('/dashboard'));
  }
  return current;
}
