'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@reeduca/ui';
import type { QuizCategoryRow } from '../actions';

type Props = {
  categories: QuizCategoryRow[];
  currentCategory?: string;
  currentStatus?: string;
};

export function PerguntasFilters({
  categories,
  currentCategory,
  currentStatus,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.push(`/admin/simulados/perguntas?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
          Categoria
        </span>
        <Select
          value={currentCategory ?? 'all'}
          onValueChange={(v) => setFilter('category', v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
          Status
        </span>
        <Select
          value={currentStatus ?? 'all'}
          onValueChange={(v) => setFilter('status', v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
