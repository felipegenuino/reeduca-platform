'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@reeduca/ui';
import { removeQuestionFromSet } from '../actions';
import { Trash2 } from 'lucide-react';

type Props = {
  quizSetId: string;
  questions: Array<{ question_id: string; position: number; statement: string }>;
};

export function SetQuestionsList({ quizSetId, questions }: Props) {
  const router = useRouter();

  const handleRemove = async (questionId: string) => {
    if (!confirm('Remover esta pergunta do conjunto?')) return;
    await removeQuestionFromSet(quizSetId, questionId);
    router.refresh();
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-8 text-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Nenhuma pergunta no conjunto. Adicione perguntas publicadas.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
      <ul className="divide-y divide-[hsl(var(--border))]">
        {questions.map((q, index) => (
          <li
            key={q.question_id}
            className="flex items-center gap-4 px-5 py-3"
          >
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] w-8 tabular-nums">
              {index + 1}.
            </span>
            <span className="flex-1 text-sm line-clamp-2 min-w-0">
              {q.statement}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-[hsl(var(--destructive))] shrink-0"
              onClick={() => handleRemove(q.question_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
