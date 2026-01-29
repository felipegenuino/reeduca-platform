import Link from 'next/link';
import { fetchQuizSets } from './actions';
import { Button } from '@reeduca/ui';
import { Plus, Pencil, Layers } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
} from '@reeduca/ui';
import { fetchSetQuestions } from './actions';

export default async function ConjuntosPage() {
  const sets = await fetchQuizSets();

  const setsWithCount = await Promise.all(
    sets.map(async (s) => {
      const questions = await fetchSetQuestions(s.id);
      return { ...s, questionCount: questions.length };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Conjuntos de desafio
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Monte e publique simulados com as perguntas cadastradas.
          </p>
        </div>
        <Link href="/admin/simulados/conjuntos/novo">
          <Button className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo conjunto
          </Button>
        </Link>
      </div>

      {setsWithCount.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-12 text-center">
          <Layers className="w-10 h-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            Nenhum conjunto ainda
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Crie um conjunto e adicione perguntas publicadas.
          </p>
          <Link href="/admin/simulados/conjuntos/novo" className="mt-4 inline-block">
            <Button>Novo conjunto</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Título</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Perguntas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Tempo (min)</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {setsWithCount.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-sm">
                    {s.slug}
                  </TableCell>
                  <TableCell className="tabular-nums">{s.questionCount}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === 'published' ? 'success' : 'secondary'}>
                      {s.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.time_limit_minutes ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/simulados/conjuntos/${s.id}`}>
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
      )}
    </div>
  );
}
