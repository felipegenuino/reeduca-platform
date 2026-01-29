'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type UserWithEmail = {
  id: string;
  user_id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  role: 'student' | 'instructor' | 'admin';
  subscription_status: 'active' | 'inactive' | 'trial' | null;
  created_at: string;
};

export type UsersListResult = {
  users: UserWithEmail[];
  total: number;
  page: number;
  pageSize: number;
};

type ProfileRow = {
  id: string;
  role: 'student' | 'instructor' | 'admin';
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

export async function fetchUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  subscriptionStatus?: string;
}): Promise<UsersListResult> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const search = params.search?.trim().toLowerCase();

  // Build a map of userId -> email from auth users
  const { data: authData, error: authError } =
    await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (authError) throw new Error(authError.message);

  const emailMap = new Map<string, string>();
  const emailMatchIds = new Set<string>();

  for (const au of authData.users) {
    emailMap.set(au.id, au.email ?? '');
    if (search && au.email?.toLowerCase().includes(search)) {
      emailMatchIds.add(au.id);
    }
  }

  // Build profiles query
  let query = admin
    .from('profiles')
    .select('id, user_id, name, avatar_url, role, subscription_status, created_at', {
      count: 'exact',
    });

  // Role filter
  if (params.role && params.role !== 'all') {
    query = query.eq('role', params.role as 'student' | 'instructor' | 'admin');
  }

  // Subscription status filter
  if (params.subscriptionStatus && params.subscriptionStatus !== 'all') {
    if (params.subscriptionStatus === 'null') {
      query = query.is('subscription_status', null);
    } else {
      query = query.eq(
        'subscription_status',
        params.subscriptionStatus as 'active' | 'inactive' | 'trial'
      );
    }
  }

  // Search: combine name ilike with email-matched user_ids
  if (search) {
    if (emailMatchIds.size > 0) {
      const ids = Array.from(emailMatchIds);
      query = query.or(`name.ilike.%${search}%,user_id.in.(${ids.join(',')})`);
    } else {
      query = query.ilike('name', `%${search}%`);
    }
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: profiles, count, error } = await query;

  if (error) throw new Error(error.message);
  if (!profiles) return { users: [], total: 0, page, pageSize };

  type ProfileResult = {
    id: string;
    user_id: string;
    name: string | null;
    avatar_url: string | null;
    role: 'student' | 'instructor' | 'admin';
    subscription_status: 'active' | 'inactive' | 'trial' | null;
    created_at: string;
  };

  const users: UserWithEmail[] = (profiles as ProfileResult[]).map((p) => ({
    id: p.id,
    user_id: p.user_id,
    name: p.name,
    email: emailMap.get(p.user_id) ?? '',
    avatar_url: p.avatar_url,
    role: p.role,
    subscription_status: p.subscription_status,
    created_at: p.created_at,
  }));

  return { users, total: count ?? 0, page, pageSize };
}
