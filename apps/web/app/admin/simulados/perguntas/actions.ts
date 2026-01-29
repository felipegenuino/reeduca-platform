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

export type QuizQuestionOption = {
  letter: string;
  text: string;
  is_correct: boolean;
};

export type QuizQuestionRow = {
  id: string;
  category_id: string;
  statement: string;
  options: QuizQuestionOption[];
  explanation: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
};

export type QuizQuestionWithCategory = QuizQuestionRow & {
  quiz_categories: { name: string; slug: string } | null;
};

export async function fetchQuestions(params: {
  categoryId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  questions: QuizQuestionWithCategory[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from('quiz_questions')
    .select('*, quiz_categories(name, slug)', { count: 'exact' });

  if (params.categoryId && params.categoryId !== 'all') {
    query = query.eq('category_id', params.categoryId);
  }
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status as 'draft' | 'published');
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  const questions = (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    quiz_categories: row.quiz_categories ?? null,
  })) as QuizQuestionWithCategory[];

  return {
    questions,
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function fetchQuestion(id: string): Promise<QuizQuestionRow | null> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as QuizQuestionRow;
}

export type CreateQuestionInput = {
  category_id: string;
  statement: string;
  options: QuizQuestionOption[];
  explanation: string;
  status?: 'draft' | 'published';
};

export async function createQuestion(
  input: CreateQuestionInput
): Promise<{ id: string }> {
  await requireAdminCaller();

  const statement = input.statement?.trim();
  if (!statement) throw new Error('Enunciado é obrigatório.');
  if (!input.options?.length || input.options.length < 2) {
    throw new Error('Adicione pelo menos 2 alternativas.');
  }
  const correctCount = input.options.filter((o) => o.is_correct).length;
  if (correctCount !== 1) throw new Error('Exatamente uma alternativa deve ser marcada como correta.');
  const explanation = input.explanation?.trim();
  if (!explanation) throw new Error('Explicação da resposta correta é obrigatória.');

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('quiz_questions')
    .insert({
      category_id: input.category_id,
      statement,
      options: input.options as never,
      explanation,
      status: input.status ?? 'draft',
    } as never)
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  if (!data?.id) throw new Error('Pergunta criada mas ID não retornado.');

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/perguntas');
  return { id: (data as { id: string }).id };
}

export type UpdateQuestionInput = {
  category_id?: string;
  statement?: string;
  options?: QuizQuestionOption[];
  explanation?: string;
  status?: 'draft' | 'published';
};

export async function updateQuestion(
  id: string,
  input: UpdateQuestionInput
): Promise<void> {
  await requireAdminCaller();

  if (input.options !== undefined) {
    if (input.options.length < 2) throw new Error('Adicione pelo menos 2 alternativas.');
    const correctCount = input.options.filter((o) => o.is_correct).length;
    if (correctCount !== 1) throw new Error('Exatamente uma alternativa deve ser marcada como correta.');
  }

  const payload: Record<string, unknown> = {};
  if (input.category_id !== undefined) payload.category_id = input.category_id;
  if (input.statement !== undefined) payload.statement = input.statement.trim();
  if (input.options !== undefined) payload.options = input.options;
  if (input.explanation !== undefined) payload.explanation = input.explanation.trim();
  if (input.status !== undefined) payload.status = input.status;

  if (Object.keys(payload).length === 0) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from('quiz_questions')
    .update({ ...payload, updated_at: new Date().toISOString() } as never)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/perguntas');
  revalidatePath(`/admin/simulados/perguntas/${id}`);
}

export async function deleteQuestion(id: string): Promise<void> {
  await requireAdminCaller();

  const admin = createAdminClient();
  const { error } = await admin.from('quiz_questions').delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/simulados');
  revalidatePath('/admin/simulados/perguntas');
}

/** Single action for form: create (no id) or update (with id). */
export async function saveQuestion(data: {
  id?: string;
  category_id: string;
  statement: string;
  options: QuizQuestionOption[];
  explanation: string;
  status: 'draft' | 'published';
}): Promise<{ id: string }> {
  const { id, ...rest } = data;
  if (id) {
    await updateQuestion(id, rest);
    return { id };
  }
  return createQuestion(rest);
}
