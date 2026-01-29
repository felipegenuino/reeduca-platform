import Link from 'next/link';
import { fetchCategories } from '../../categorias/actions';
import { QuestionForm } from '../components/QuestionForm';
import { saveQuestion } from '../actions';
import { Button } from '@reeduca/ui';
import { ArrowLeft } from 'lucide-react';

export default async function NovaPerguntaPage() {
  const categories = await fetchCategories();

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
            Nova pergunta
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Preencha o enunciado, alternativas e explicação.
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-8 text-center">
          <p className="text-sm text-[hsl(var(--foreground))]">
            Crie primeiro uma categoria em Simulados → Categorias.
          </p>
          <Link href="/admin/simulados/categorias/nova" className="mt-3 inline-block">
            <Button>Ir para Categorias</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-2xl">
          <QuestionForm
            categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            initialCategoryId={categories[0]?.id}
            submitLabel="Criar pergunta"
            onSubmit={saveQuestion}
            onCancel={() => window.history.back()}
            successRedirect="/admin/simulados/perguntas"
          />
        </div>
      )}
    </div>
  );
}
