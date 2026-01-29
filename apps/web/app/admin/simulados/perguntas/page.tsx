import { Suspense } from 'react';
import Link from 'next/link';
import { fetchQuestions } from './actions';
import { fetchCategories } from '../categorias/actions';
import { PerguntasFilters } from './components/PerguntasFilters';
import { PerguntasTable } from './components/PerguntasTable';
import { Button } from '@reeduca/ui';
import { Plus } from 'lucide-react';

export default async function PerguntasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [result, categories] = await Promise.all([
    fetchQuestions({
      page,
      categoryId: params.category,
      status: params.status,
    }),
    fetchCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Perguntas
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Cadastre enunciados, alternativas e explicações para os simulados.
          </p>
        </div>
        <Link href="/admin/simulados/perguntas/nova">
          <Button className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova pergunta
          </Button>
        </Link>
      </div>

      <PerguntasFilters
        categories={categories}
        currentCategory={params.category}
        currentStatus={params.status}
      />

      <Suspense fallback={<div className="text-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>}>
        <PerguntasTable
          questions={result.questions}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          categoryParam={params.category}
          statusParam={params.status}
        />
      </Suspense>
    </div>
  );
}
