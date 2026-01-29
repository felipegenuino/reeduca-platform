'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@reeduca/ui';
import type { ResultData, QuestionForReview, AnswerSnapshotItem } from '../../../actions';

type Props = { data: ResultData };

function getAnswerForQuestion(
  snapshot: AnswerSnapshotItem[],
  questionId: string
): { chosen_letter: string; correct: boolean } | null {
  const a = snapshot.find((x) => x.question_id === questionId);
  return a ? { chosen_letter: a.chosen_letter, correct: a.correct ?? false } : null;
}

function getCorrectLetter(options: QuestionForReview['options']): string | null {
  const opt = options.find((o) => o.is_correct);
  return opt ? opt.letter : null;
}

export function ResultadoClient({ data }: Props) {
  const { attempt, setTitle, setSlug, questions } = data;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
        <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">{setTitle}</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Resultado da tentativa
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[hsl(var(--primary))]" />
            <span className="text-2xl font-semibold tabular-nums text-[hsl(var(--foreground))]">
              {attempt.score}/{attempt.total}
            </span>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {attempt.score === attempt.total
              ? 'Todos os acertos!'
              : `${attempt.total - attempt.score} ${attempt.total - attempt.score === 1 ? 'questão para revisar' : 'questões para revisar'}.`}
          </p>
        </div>
      </div>

      {/* Lista de perguntas com revisão */}
      <div>
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">
          Revisar questões
        </h3>
        <ul className="space-y-2">
          {questions.map((q, index) => {
            const answer = getAnswerForQuestion(attempt.answers_snapshot, q.id);
            const correctLetter = getCorrectLetter(q.options);
            const isExpanded = expandedId === q.id;

            return (
              <li
                key={q.id}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-[hsl(var(--muted))]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {answer?.correct ? (
                      <Check className="w-5 h-5 shrink-0 text-[hsl(var(--success))]" />
                    ) : (
                      <X className="w-5 h-5 shrink-0 text-[hsl(var(--destructive))]" />
                    )}
                    <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                      Questão {index + 1}
                      {answer != null && (
                        <span className="text-[hsl(var(--muted-foreground))] font-normal">
                          {' '}
                          — sua resposta: {answer.chosen_letter}
                          {correctLetter != null && answer.chosen_letter !== correctLetter && (
                            <> · Correta: {correctLetter}</>
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-[hsl(var(--border))]">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] mt-3 whitespace-pre-wrap">
                      {q.statement}
                    </p>
                    <div className="mt-2 space-y-1">
                      {q.options
                        .slice()
                        .sort((a, b) => (a.letter < b.letter ? -1 : 1))
                        .map((opt) => (
                          <p
                            key={opt.letter}
                            className={`text-sm ${
                              opt.is_correct
                                ? 'text-[hsl(var(--success))] font-medium'
                                : answer?.chosen_letter === opt.letter
                                  ? 'text-[hsl(var(--destructive))]'
                                  : 'text-[hsl(var(--muted-foreground))]'
                            }`}
                          >
                            {opt.letter}) {opt.text}
                            {opt.is_correct && ' ✓'}
                          </p>
                        ))}
                    </div>
                    <div className="mt-3 rounded-md bg-[hsl(var(--muted))]/50 px-3 py-2">
                      <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">
                        Explicação
                      </p>
                      <p className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dashboard/simulados/${setSlug}/fazer`}>
          <Button variant="outline" size="sm">
            Refazer simulado
          </Button>
        </Link>
        <Link href="/dashboard/simulados">
          <Button variant="ghost" size="sm">
            Voltar aos simulados
          </Button>
        </Link>
      </div>
    </div>
  );
}
