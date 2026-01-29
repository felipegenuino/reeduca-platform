import Link from 'next/link';
import { ClipboardList, Clock, FileQuestion, Play, RotateCcw } from 'lucide-react';
import { Button } from '@reeduca/ui';
import {
  getPublishedQuizSets,
  getMyLastAttemptsByQuizSet,
} from './actions';

export default async function SimuladosPage() {
  const [sets, lastAttempts] = await Promise.all([
    getPublishedQuizSets(),
    getMyLastAttemptsByQuizSet(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-[hsl(var(--primary))]" />
          Simulados
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Conjuntos de questões para praticar. Inicie um simulado, responda questão a questão e revise o resultado.
        </p>
      </div>

      {sets.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-8 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Nenhum simulado publicado no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((set) => {
            const attempt = lastAttempts[set.id];
            const hasAttempt = attempt != null && attempt.finished_at != null;
            return (
              <article
                key={set.id}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col"
              >
                <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
                  <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                    {set.title}
                  </h2>
                </div>
                <div className="px-5 py-4 flex-1 flex flex-col gap-3">
                  {set.description && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                      {set.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                    <span className="inline-flex items-center gap-1">
                      <FileQuestion className="w-3.5 h-3.5" />
                      {set.questions_count} questões
                    </span>
                    {set.time_limit_minutes != null && set.time_limit_minutes > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {set.time_limit_minutes} min
                      </span>
                    )}
                  </div>
                  {hasAttempt && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
                      Última tentativa: {attempt.score}/{attempt.total} acertos
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    <Link href={`/dashboard/simulados/${set.slug}/fazer`}>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        {hasAttempt ? (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            Refazer
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Iniciar
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
