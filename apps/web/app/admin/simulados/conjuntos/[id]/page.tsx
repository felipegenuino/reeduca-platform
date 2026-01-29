import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchQuizSet, fetchSetQuestions } from '../actions';
import { createClient } from '@/lib/supabase/server';
import { EditConjuntoForm } from '../components/EditConjuntoForm';
import { SetQuestionsList } from '../components/SetQuestionsList';
import { Button } from '@reeduca/ui';
import { ArrowLeft, Plus } from 'lucide-react';

type ProfileRow = { id: string; role: string };

export default async function EditarConjuntoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!(profile as ProfileRow) || (profile as ProfileRow).role !== 'admin') {
    notFound();
  }

  const [quizSet, setQuestions] = await Promise.all([
    fetchQuizSet(id),
    fetchSetQuestions(id),
  ]);

  if (!quizSet) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/simulados/conjuntos">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Editar conjunto
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            {quizSet.title}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-xl">
        <EditConjuntoForm
          id={id}
          initialTitle={quizSet.title}
          initialSlug={quizSet.slug}
          initialDescription={quizSet.description ?? ''}
          initialStatus={quizSet.status}
          initialTimeLimitMinutes={quizSet.time_limit_minutes}
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
            Perguntas do conjunto
          </h2>
          <Link href={`/admin/simulados/conjuntos/${id}/adicionar-perguntas`}>
            <Button size="sm" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar perguntas
            </Button>
          </Link>
        </div>
        <SetQuestionsList
          quizSetId={id}
          questions={setQuestions.map((q) => ({
            question_id: q.question_id,
            position: q.position,
            statement:
              (q as { quiz_questions: { statement: string } | null }).quiz_questions
                ?.statement ?? '',
          }))}
        />
      </section>
    </div>
  );
}
