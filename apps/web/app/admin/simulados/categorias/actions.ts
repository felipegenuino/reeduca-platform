'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type ProfileRow = { id: string; role: string };

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

export type QuizCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function fetchCategories(): Promise<QuizCategoryRow[]> {
  await requireAdminCaller();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as QuizCategoryRow[];
}

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
};

export async function createCategory(
  input: CreateCategoryInput
): Promise<{ id: string }> {
  await requireAdminCaller();

  const name = input.name?.trim();
  if (!name) throw new Error('Nome é obrigatório.');
  const slug = (input.slug?.trim() || slugify(name)).toLowerCase();
  if (!slug) throw new Error('Slug é obrigatório.');

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_categories')
    .insert({
      name,
      slug,
      description: input.description?.trim() || null,
      sort_order: input.sort_order ?? 0,
    } as never)
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Já existe uma categoria com este slug.');
    throw new Error(error.message);
  }
  if (!data?.id) throw new Error('Categoria criada mas ID não retornado.');

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/categorias');
  return { id: (data as { id: string }).id };
}

export type UpdateCategoryInput = {
  name?: string;
  slug?: string;
  description?: string;
  sort_order?: number;
};

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<void> {
  await requireAdminCaller();

  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.slug !== undefined) payload.slug = input.slug.trim().toLowerCase();
  if (input.description !== undefined)
    payload.description = input.description.trim() || null;
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;

  if (Object.keys(payload).length === 0) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from('quiz_categories')
    .update({ ...payload, updated_at: new Date().toISOString() } as never)
    .eq('id', id);

  if (error) {
    if (error.code === '23505') throw new Error('Já existe uma categoria com este slug.');
    throw new Error(error.message);
  }

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/categorias');
  revalidatePath(`/admin/simulados/categorias/${id}`);
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin.from('quiz_categories').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/categorias');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
