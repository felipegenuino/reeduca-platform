'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type ProfileRow = {
  id: string;
  role: 'cadastrado' | 'student' | 'instructor' | 'admin';
};

async function requireAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado');

  const { data } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  const profile = data as ProfileRow | null;
  if (!profile || profile.role !== 'admin') throw new Error('Acesso negado');
  return user;
}

export type UserDetail = {
  id: string;
  user_id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  role: 'cadastrado' | 'student' | 'instructor' | 'admin';
  subscription_status: 'active' | 'inactive' | 'trial' | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
};

export async function fetchUserDetail(profileId: string): Promise<UserDetail> {
  await requireAdminCaller();

  const admin = createAdminClient();

  type FullProfile = {
    id: string;
    user_id: string;
    name: string | null;
    avatar_url: string | null;
    role: 'cadastrado' | 'student' | 'instructor' | 'admin';
    subscription_status: 'active' | 'inactive' | 'trial' | null;
    metadata: unknown;
    created_at: string;
    updated_at: string;
  };

  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  const profile = data as FullProfile | null;
  if (error || !profile) throw new Error('Usuário não encontrado');

  const {
    data: { user: authUser },
    error: authError,
  } = await admin.auth.admin.getUserById(profile.user_id);

  if (authError) throw new Error(authError.message);

  return {
    id: profile.id,
    user_id: profile.user_id,
    name: profile.name,
    email: authUser?.email ?? '',
    avatar_url: profile.avatar_url,
    role: profile.role,
    subscription_status: profile.subscription_status,
    metadata: profile.metadata,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    last_sign_in_at: authUser?.last_sign_in_at ?? null,
  };
}

export async function updateUserRole(
  profileId: string,
  newRole: 'cadastrado' | 'student' | 'instructor' | 'admin'
): Promise<{ success: boolean }> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() } as never)
    .eq('id', profileId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/pessoas');
  revalidatePath(`/admin/pessoas/${profileId}`);

  return { success: true };
}

export async function updateSubscriptionStatus(
  profileId: string,
  newStatus: 'active' | 'inactive' | 'trial' | null
): Promise<{ success: boolean }> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({
      subscription_status: newStatus,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', profileId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/pessoas');
  revalidatePath(`/admin/pessoas/${profileId}`);

  return { success: true };
}

export async function deactivateUser(
  profileId: string
): Promise<{ success: boolean }> {
  await requireAdminCaller();

  const admin = createAdminClient();

  const { error } = await admin
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', profileId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/pessoas');
  revalidatePath(`/admin/pessoas/${profileId}`);

  return { success: true };
}
