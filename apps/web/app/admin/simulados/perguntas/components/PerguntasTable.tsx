'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Button,
} from '@reeduca/ui';
import type { QuizQuestionWithCategory } from '../actions';
import { Pencil, ListChecks } from 'lucide-react';

type Props = {
  questions: QuizQuestionWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  categoryParam?: string;
  statusParam?: string;
};

function buildPageUrl(
  basePage: number,
  category?: string,
  status?: string
): string {
  const params = new URLSearchParams();
  if (basePage > 1) params.set('page', String(basePage));
  if (category && category !== 'all') params.set('category', category);
  if (status && status !== 'all') params.set('status', status);
  const q = params.toString();
  return `/admin/simulados/perguntas${q ? `?${q}` : ''}`;
}

export function PerguntasTable({
  questions,
  total,
  page,
  pageSize,
  categoryParam,
  statusParam,
}: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-12 text-center">
        <ListChecks className="w-10 h-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
          Nenhuma pergunta encontrada
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          Tente ajustar os filtros ou cadastre uma nova pergunta.
        </p>
        <Link href="/admin/simulados/perguntas/nova" className="mt-4 inline-block">
          <Button>Nova pergunta</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="max-w-[320px]">Enunciado</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow
                key={q.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/simulados/perguntas/${q.id}`)}
              >
                <TableCell className="max-w-[320px]">
                  <span className="line-clamp-2 text-sm">{q.statement}</span>
                </TableCell>
                <TableCell className="text-sm text-[hsl(var(--muted-foreground))]">
                  {(q as QuizQuestionWithCategory).quiz_categories?.name ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={q.status === 'published' ? 'success' : 'secondary'}>
                    {q.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/simulados/perguntas/${q.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-[hsl(var(--muted-foreground))]">
            {total} pergunta(s) · página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildPageUrl(page - 1, categoryParam, statusParam)}>
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildPageUrl(page + 1, categoryParam, statusParam)}>
                <Button variant="outline" size="sm">
                  Próxima
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
