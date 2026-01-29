'use server';

import { createClient } from '@/lib/supabase/server';

export type PublishedQuizSet = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  time_limit_minutes: number | null;
  created_at: string;
  questions_count: number;
};

export type QuizAttemptSummary = {
  id: string;
  quiz_set_id: string;
  score: number;
  total: number;
  finished_at: string | null;
  started_at: string;
};

/** Lista conjuntos publicados com contagem de perguntas. Requer usuário autenticado (RLS). */
export async function getPublishedQuizSets(): Promise<PublishedQuizSet[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: sets, error: setsError } = await supabase
    .from('quiz_sets')
    .select('id, title, slug, description, time_limit_minutes, created_at')
    .eq('status', 'published')
    .order('title', { ascending: true });

  if (setsError || !sets?.length) return [];

  const ids = sets.map((s) => s.id);
  const { data: links, error: linksError } = await supabase
    .from('quiz_set_questions')
    .select('quiz_set_id')
    .in('quiz_set_id', ids);

  if (linksError) return sets.map((s) => ({ ...s, questions_count: 0 }));

  const countBySet: Record<string, number> = {};
  ids.forEach((id) => (countBySet[id] = 0));
  links?.forEach((row) => {
    countBySet[row.quiz_set_id] = (countBySet[row.quiz_set_id] ?? 0) + 1;
  });

  return sets.map((s) => ({
    ...s,
    questions_count: countBySet[s.id] ?? 0,
  })) as PublishedQuizSet[];
}

/** Última tentativa por conjunto (para exibir "X/Y acertos" na listagem). */
export async function getMyLastAttemptsByQuizSet(): Promise<
  Record<string, QuizAttemptSummary>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data: attempts, error } = await supabase
    .from('quiz_attempts')
    .select('id, quiz_set_id, score, total, finished_at, started_at')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  if (error || !attempts?.length) return {};

  const bySet: Record<string, QuizAttemptSummary> = {};
  attempts.forEach((a) => {
    if (!bySet[a.quiz_set_id]) {
      bySet[a.quiz_set_id] = a as QuizAttemptSummary;
    }
  });
  return bySet;
}

// --- Fazer simulado ---

export type QuizOption = { letter: string; text: string; is_correct: boolean };
export type QuizQuestionForAttempt = {
  id: string;
  statement: string;
  options: QuizOption[];
  position: number;
};

export type QuizSetForAttempt = {
  id: string;
  title: string;
  slug: string;
  time_limit_minutes: number | null;
  questions: QuizQuestionForAttempt[];
};

/** Busca conjunto publicado por slug com perguntas ordenadas (sem explanation para não vazar). */
export async function getQuizSetBySlug(
  slug: string
): Promise<QuizSetForAttempt | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: set, error: setError } = await supabase
    .from('quiz_sets')
    .select('id, title, slug, time_limit_minutes')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (setError || !set) return null;

  const { data: links, error: linksError } = await supabase
    .from('quiz_set_questions')
    .select('question_id, position')
    .eq('quiz_set_id', set.id)
    .order('position', { ascending: true });

  if (linksError || !links?.length) {
    return { ...set, questions: [] } as QuizSetForAttempt;
  }

  const questionIds = links.map((l) => l.question_id);
  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, statement, options')
    .in('id', questionIds)
    .eq('status', 'published');

  if (qError || !questions?.length) {
    return { ...set, questions: [] } as QuizSetForAttempt;
  }

  const qMap = new Map(questions.map((q) => [q.id, q]));
  const ordered = links
    .map((l) => {
      const q = qMap.get(l.question_id);
      if (!q) return null;
      return {
        id: q.id,
        statement: q.statement,
        options: (q.options as QuizOption[]) ?? [],
        position: l.position,
      };
    })
    .filter(Boolean) as QuizQuestionForAttempt[];

  return { ...set, questions: ordered } as QuizSetForAttempt;
}

export type AnswerSnapshotItem = {
  question_id: string;
  chosen_letter: string;
  correct?: boolean;
};

export type AttemptInProgress = {
  id: string;
  quiz_set_id: string;
  total: number;
  answers_snapshot: AnswerSnapshotItem[];
  started_at: string;
};

/** Retorna tentativa em andamento (finished_at null) do usuário para o conjunto. */
export async function getAttemptInProgress(
  quizSetId: string
): Promise<AttemptInProgress | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, quiz_set_id, total, answers_snapshot, started_at')
    .eq('user_id', user.id)
    .eq('quiz_set_id', quizSetId)
    .is('finished_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as AttemptInProgress;
}

/** Cria nova tentativa e retorna o id. */
export async function startAttempt(quizSetId: string): Promise<{ attemptId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado' };

  const { count } = await supabase
    .from('quiz_set_questions')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_set_id', quizSetId);

  const total = count ?? 0;
  if (total === 0) return { error: 'Conjunto sem perguntas.' };

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      quiz_set_id: quizSetId,
      total,
      score: 0,
      answers_snapshot: [],
    } as never)
    .select('id')
    .single();

  if (error) return { error: error.message };
  if (!data?.id) return { error: 'Falha ao criar tentativa.' };
  return { attemptId: (data as { id: string }).id };
}

/** Atualiza answers_snapshot com a resposta da questão (append ou replace). */
export async function saveAnswer(
  attemptId: string,
  questionId: string,
  chosenLetter: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado' };

  const { data: attempt, error: fetchError } = await supabase
    .from('quiz_attempts')
    .select('answers_snapshot')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .is('finished_at', null)
    .single();

  if (fetchError || !attempt) return { error: 'Tentativa não encontrada ou já finalizada.' };

  const snapshot = (attempt.answers_snapshot as AnswerSnapshotItem[]) ?? [];
  const filtered = snapshot.filter((a) => a.question_id !== questionId);
  const updated = [...filtered, { question_id: questionId, chosen_letter: chosenLetter }];

  const { error: updateError } = await supabase
    .from('quiz_attempts')
    .update({
      answers_snapshot: updated,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', attemptId)
    .eq('user_id', user.id);

  if (updateError) return { error: updateError.message };
  return {};
}

/** Finaliza tentativa: calcula score, preenche correct em answers_snapshot. */
export async function finishAttempt(attemptId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autorizado' };

  const { data: attempt, error: fetchError } = await supabase
    .from('quiz_attempts')
    .select('quiz_set_id, total, answers_snapshot')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .is('finished_at', null)
    .single();

  if (fetchError || !attempt) return { error: 'Tentativa não encontrada ou já finalizada.' };

  const snapshot = (attempt.answers_snapshot as AnswerSnapshotItem[]) ?? [];
  const questionIds = snapshot.map((a) => a.question_id);
  if (questionIds.length === 0) {
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        finished_at: new Date().toISOString(),
        score: 0,
        answers_snapshot: [],
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', attemptId)
      .eq('user_id', user.id);
    if (updateError) return { error: updateError.message };
    return {};
  }

  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, options')
    .in('id', questionIds);

  if (qError || !questions?.length) {
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        finished_at: new Date().toISOString(),
        score: 0,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', attemptId)
      .eq('user_id', user.id);
    if (updateError) return { error: updateError.message };
    return {};
  }

  const correctByQuestion = new Map<string, string>();
  questions.forEach((q) => {
    const opts = (q.options as QuizOption[]) ?? [];
    const correct = opts.find((o) => o.is_correct);
    if (correct) correctByQuestion.set(q.id, correct.letter);
  });

  let score = 0;
  const newSnapshot: AnswerSnapshotItem[] = snapshot.map((a) => {
    const correctLetter = correctByQuestion.get(a.question_id);
    const correct = correctLetter != null && a.chosen_letter === correctLetter;
    if (correct) score += 1;
    return { ...a, correct };
  });

  const { error: updateError } = await supabase
    .from('quiz_attempts')
    .update({
      finished_at: new Date().toISOString(),
      score,
      answers_snapshot: newSnapshot,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', attemptId)
    .eq('user_id', user.id);

  if (updateError) return { error: updateError.message };
  return {};
}

// --- Resultado e revisão ---

export type AttemptForResult = {
  id: string;
  quiz_set_id: string;
  score: number;
  total: number;
  finished_at: string;
  answers_snapshot: AnswerSnapshotItem[];
};

export type QuestionForReview = {
  id: string;
  statement: string;
  options: QuizOption[];
  explanation: string;
};

export type ResultData = {
  attempt: AttemptForResult;
  setTitle: string;
  setSlug: string;
  questions: QuestionForReview[];
};

/** Retorna tentativa finalizada do usuário e perguntas com explicação para revisão. */
export async function getAttemptResult(
  attemptId: string
): Promise<ResultData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: attempt, error: attemptError } = await supabase
    .from('quiz_attempts')
    .select('id, quiz_set_id, score, total, finished_at, answers_snapshot')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .not('finished_at', 'is', null)
    .single();

  if (attemptError || !attempt) return null;

  const { data: setRow, error: setError } = await supabase
    .from('quiz_sets')
    .select('title, slug')
    .eq('id', attempt.quiz_set_id)
    .single();

  if (setError || !setRow) return null;

  const snapshot = (attempt.answers_snapshot as AnswerSnapshotItem[]) ?? [];
  const questionIds = snapshot.map((a) => a.question_id);
  if (questionIds.length === 0) {
    return {
      attempt: attempt as AttemptForResult,
      setTitle: (setRow as { title: string }).title,
      setSlug: (setRow as { slug: string }).slug,
      questions: [],
    };
  }

  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, statement, options, explanation')
    .in('id', questionIds);

  if (qError || !questions?.length) {
    return {
      attempt: attempt as AttemptForResult,
      setTitle: (setRow as { title: string }).title,
      setSlug: (setRow as { slug: string }).slug,
      questions: [],
    };
  }

  const orderMap = new Map(
    snapshot.map((a, i) => [a.question_id, i])
  );
  const ordered = [...questions].sort(
    (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
  ) as QuestionForReview[];

  return {
    attempt: attempt as AttemptForResult,
    setTitle: (setRow as { title: string }).title,
    setSlug: (setRow as { slug: string }).slug,
    questions: ordered,
  };
}
