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

export type QuizSetRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'published';
  time_limit_minutes: number | null;
  created_at: string;
  updated_at: string;
};

export async function fetchQuizSets(): Promise<QuizSetRow[]> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_sets')
    .select('*')
    .order('title', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as QuizSetRow[];
}

export async function fetchQuizSet(id: string): Promise<QuizSetRow | null> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_sets')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as QuizSetRow;
}

export type QuizSetQuestionRow = {
  quiz_set_id: string;
  question_id: string;
  position: number;
};

export async function fetchSetQuestions(
  quizSetId: string
): Promise<Array<QuizSetQuestionRow & { quiz_questions: { id: string; statement: string; status: string } | null }>> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_set_questions')
    .select('quiz_set_id, question_id, position, quiz_questions(id, statement, status)')
    .eq('quiz_set_id', quizSetId)
    .order('position', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Array<
    QuizSetQuestionRow & { quiz_questions: { id: string; statement: string; status: string } | null }
  >;
}

export type CreateQuizSetInput = {
  title: string;
  slug: string;
  description?: string;
  status?: 'draft' | 'published';
  time_limit_minutes?: number | null;
};

export async function createQuizSet(
  input: CreateQuizSetInput
): Promise<{ id: string }> {
  await requireAdminCaller();

  const title = input.title?.trim();
  if (!title) throw new Error('Título é obrigatório.');
  const slug = (input.slug?.trim() || slugify(title)).toLowerCase();
  if (!slug) throw new Error('Slug é obrigatório.');

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_sets')
    .insert({
      title,
      slug,
      description: input.description?.trim() || null,
      status: input.status ?? 'draft',
      time_limit_minutes: input.time_limit_minutes ?? null,
    } as never)
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('Já existe um conjunto com este slug.');
    throw new Error(error.message);
  }
  if (!data?.id) throw new Error('Conjunto criado mas ID não retornado.');

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/conjuntos');
  return { id: (data as { id: string }).id };
}

export type UpdateQuizSetInput = {
  title?: string;
  slug?: string;
  description?: string;
  status?: 'draft' | 'published';
  time_limit_minutes?: number | null;
};

export async function updateQuizSet(
  id: string,
  input: UpdateQuizSetInput
): Promise<void> {
  await requireAdminCaller();

  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.slug !== undefined) payload.slug = input.slug.trim().toLowerCase();
  if (input.description !== undefined)
    payload.description = input.description.trim() || null;
  if (input.status !== undefined) payload.status = input.status;
  if (input.time_limit_minutes !== undefined)
    payload.time_limit_minutes = input.time_limit_minutes;

  if (Object.keys(payload).length === 0) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from('quiz_sets')
    .update({ ...payload, updated_at: new Date().toISOString() } as never)
    .eq('id', id);

  if (error) {
    if (error.code === '23505') throw new Error('Já existe um conjunto com este slug.');
    throw new Error(error.message);
  }

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/conjuntos');
  revalidatePath(`/admin/simulados/conjuntos/${id}`);
}

export async function deleteQuizSet(id: string): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin.from('quiz_sets').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/conjuntos');
}

export async function addQuestionToSet(
  quizSetId: string,
  questionId: string,
  position: number
): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin
    .from('quiz_set_questions')
    .insert({ quiz_set_id: quizSetId, question_id: questionId, position } as never);

  if (error) {
    if (error.code === '23505') throw new Error('Esta pergunta já está no conjunto.');
    throw new Error(error.message);
  }

  revalidatePath(`/admin/simulados/conjuntos/${quizSetId}`);
}

export async function removeQuestionFromSet(
  quizSetId: string,
  questionId: string
): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin
    .from('quiz_set_questions')
    .delete()
    .eq('quiz_set_id', quizSetId)
    .eq('question_id', questionId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/simulados/conjuntos/${quizSetId}`);
}

export async function reorderSetQuestions(
  quizSetId: string,
  orderedQuestionIds: string[]
): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  for (let i = 0; i < orderedQuestionIds.length; i++) {
    const { error } = await admin
      .from('quiz_set_questions')
      .update({ position: i } as never)
      .eq('quiz_set_id', quizSetId)
      .eq('question_id', orderedQuestionIds[i]);

    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/simulados/conjuntos/${quizSetId}`);
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
