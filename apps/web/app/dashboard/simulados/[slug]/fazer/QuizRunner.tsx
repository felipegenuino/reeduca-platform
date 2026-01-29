'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react';
import { Button } from '@reeduca/ui';
import type { QuizSetForAttempt, AttemptInProgress, AnswerSnapshotItem } from '../../actions';
import {
  startAttempt,
  saveAnswer,
  finishAttempt,
} from '../../actions';

type Props = {
  set: QuizSetForAttempt;
  attempt: AttemptInProgress | null;
};

export function QuizRunner({ set, attempt: initialAttempt }: Props) {
  const router = useRouter();
  const questions = set.questions;
  const total = questions.length;
  const initialIndex =
    initialAttempt && total > 0
      ? Math.min(initialAttempt.answers_snapshot.length, total - 1)
      : 0;
  const initialQuestion = questions[initialIndex];
  const initialAnswer = initialQuestion
    ? initialAttempt?.answers_snapshot.find((x) => x.question_id === initialQuestion.id)?.chosen_letter ?? null
    : null;

  const [attemptId, setAttemptId] = useState<string | null>(initialAttempt?.id ?? null);
  const [answers, setAnswers] = useState<AnswerSnapshotItem[]>(
    initialAttempt?.answers_snapshot ?? []
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [chosenLetter, setChosenLetter] = useState<string | null>(initialAnswer);
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  const finishRef = useRef({ attemptId: null as string | null, slug: '' });
  finishRef.current = { attemptId, slug: set.slug };

  const hasTimer = set.time_limit_minutes != null && set.time_limit_minutes > 0;

  useEffect(() => {
    if (!hasTimer || !attemptId) return;
    const limitSeconds = set.time_limit_minutes! * 60;
    setTimeLeftSeconds(limitSeconds);
    const interval = setInterval(async () => {
      setTimeLeftSeconds((prev) => {
        if (prev == null || prev <= 1) {
          clearInterval(interval);
          const { attemptId: id, slug } = finishRef.current;
          if (id) {
            finishAttempt(id).then(() => {
              router.push(`/dashboard/simulados/${slug}/resultado/${id}`);
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasTimer, attemptId, set.time_limit_minutes, set.slug, router]);

  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const handleStart = async () => {
    setStarting(true);
    const result = await startAttempt(set.id);
    setStarting(false);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    setAttemptId(result.attemptId);
    setAnswers([]);
    setCurrentIndex(0);
    setChosenLetter(null);
  };

  const getSavedLetter = (qId: string) => answers.find((a) => a.question_id === qId)?.chosen_letter ?? null;

  const syncChosenToSaved = () => {
    if (question && chosenLetter != null) {
      const existing = answers.find((a) => a.question_id === question.id);
      if (!existing || existing.chosen_letter !== chosenLetter) {
        setAnswers((prev) => {
          const rest = prev.filter((a) => a.question_id !== question.id);
          return [...rest, { question_id: question.id, chosen_letter: chosenLetter }];
        });
      }
    }
  };

  const handlePrevious = () => {
    syncChosenToSaved();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      const prevQ = questions[currentIndex - 1];
      setChosenLetter(getSavedLetter(prevQ.id));
    }
  };

  const handleNext = async () => {
    if (!question || !attemptId) return;
    if (chosenLetter == null) {
      setChosenLetter(getSavedLetter(question.id));
    }
    syncChosenToSaved();
    setSaving(true);
    await saveAnswer(attemptId, question.id, chosenLetter ?? '');
    setSaving(false);
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      const nextQ = questions[currentIndex + 1];
      setChosenLetter(getSavedLetter(nextQ.id));
    }
  };

  const handleFinish = async () => {
    if (!question || !attemptId) return;
    syncChosenToSaved();
    setSaving(true);
    await saveAnswer(attemptId, question.id, chosenLetter ?? '');
    await finishAttempt(attemptId);
    setSaving(false);
    router.push(`/dashboard/simulados/${set.slug}/resultado/${attemptId}`);
  };

  if (total === 0) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-8 text-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Este simulado não possui perguntas no momento.
        </p>
        <Link href="/dashboard/simulados" className="mt-4 inline-block text-sm font-medium text-[hsl(var(--primary))] hover:underline">
          Voltar aos simulados
        </Link>
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-6">
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">{set.title}</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {total} questões
            {hasTimer && ` · Tempo limite: ${set.time_limit_minutes} min`}
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
            Ao iniciar, você responderá uma questão por vez. Use Anterior/Próximo para navegar. Ao finalizar, verá seu resultado e poderá revisar as explicações.
          </p>
          <div className="mt-6">
            <Button onClick={handleStart} disabled={starting}>
              {starting ? 'Iniciando…' : 'Iniciar simulado'}
            </Button>
          </div>
        </div>
        <Link href="/dashboard/simulados" className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
          ← Voltar aos simulados
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header: título, progresso, timer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">{set.title}</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
            Questão {currentIndex + 1} de {total}
          </p>
        </div>
        {hasTimer && timeLeftSeconds != null && (
          <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums text-[hsl(var(--foreground))]">
            <Clock className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            {Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Enunciado + alternativas */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
        <p className="text-sm font-medium text-[hsl(var(--foreground))] whitespace-pre-wrap">
          {question.statement}
        </p>
        <fieldset className="mt-4 space-y-2">
          <legend className="sr-only">Alternativas</legend>
          {question.options
            .slice()
            .sort((a, b) => (a.letter < b.letter ? -1 : 1))
            .map((opt) => (
              <label
                key={opt.letter}
                className={`
                  flex items-start gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors
                  ${chosenLetter === opt.letter
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent))]'
                    : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={opt.letter}
                  checked={chosenLetter === opt.letter}
                  onChange={() => setChosenLetter(opt.letter)}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {opt.letter}) {opt.text}
                </span>
              </label>
            ))}
        </fieldset>
      </div>

      {/* Navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={isFirst || saving}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        <div className="flex gap-2">
          {!isLast ? (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={saving}
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleFinish}
              disabled={saving}
            >
              <Flag className="w-4 h-4" />
              {saving ? 'Finalizando…' : 'Finalizar'}
            </Button>
          )}
        </div>
      </div>

      <Link href="/dashboard/simulados" className="inline-block text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
        ← Voltar aos simulados
      </Link>
    </div>
  );
}
