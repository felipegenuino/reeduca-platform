import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchQuestion, saveQuestion } from '../actions';
import { fetchCategories } from '../../categorias/actions';
import { QuestionForm } from '../components/QuestionForm';
import { Button } from '@reeduca/ui';
import { ArrowLeft } from 'lucide-react';
import type { QuizQuestionOption } from '../actions';

export default async function EditarPerguntaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [question, categories] = await Promise.all([
    fetchQuestion(id),
    fetchCategories(),
  ]);

  if (!question) notFound();
  if (categories.length === 0) notFound();

  const options = (question.options as unknown as QuizQuestionOption[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/simulados/perguntas">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Editar pergunta
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">
            {question.statement}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-2xl">
        <QuestionForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          initialStatement={question.statement}
          initialOptions={options}
          initialExplanation={question.explanation}
          initialCategoryId={question.category_id}
          initialStatus={question.status}
          submitLabel="Salvar"
          onSubmit={saveQuestion}
          onCancel={() => window.history.back()}
          successRedirect="/admin/simulados/perguntas"
          editId={id}
        />
      </div>
    </div>
  );
}
