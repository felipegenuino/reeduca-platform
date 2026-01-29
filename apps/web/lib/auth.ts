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

  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, user_id, name, avatar_url, role, subscription_status, created_at, updated_at')
    .eq('user_id', user.id)
    .single();

  // Se o perfil não existe, tenta criar (fallback se o trigger falhou)
  if (profileError || !profile) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        role: 'student',
      } as never)
      .select('id, user_id, name, avatar_url, role, subscription_status, created_at, updated_at')
      .single();

    if (createError || !newProfile) {
      // Se falhar ao criar (ex: policy não existe), retorna null
      // A página vai redirecionar para login
      return null;
    }
    profile = newProfile;
  }

  return {
    user,
    profile: profile as unknown as Profile,
  };
}

/**
 * Exige usuário autenticado. Redireciona para /login se não houver sessão.
 * Cria perfil automaticamente se o usuário existir mas o perfil não.
 * Use em layouts ou páginas que devem ser protegidas no servidor também.
 */
export async function requireCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const { redirect } = await import('next/navigation');
    redirect('/login?redirectTo=' + encodeURIComponent('/dashboard'));
  }

  // Verifica se o perfil existe
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, user_id, name, avatar_url, role, subscription_status, created_at, updated_at')
    .eq('user_id', user!.id)
    .single();

  // Se não existe, cria o perfil (fallback se o trigger falhou)
  if (profileError || !profile) {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: user!.id,
        name: user!.user_metadata?.name || null,
        avatar_url: user!.user_metadata?.avatar_url || null,
        role: 'student',
      } as never)
      .select('id, user_id, name, avatar_url, role, subscription_status, created_at, updated_at')
      .single();

    if (createError || !newProfile) {
      // Se falhar ao criar, faz logout forçado para o usuário criar conta novamente
      // ou aguardar o trigger criar o perfil
      await supabase.auth.signOut();
      const { redirect } = await import('next/navigation');
      redirect('/login?error=profile_missing');
    }
    profile = newProfile;
  }

  return {
    user: user!,
    profile: profile as unknown as Profile,
  };
}
