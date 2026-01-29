'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@reeduca/ui';
import type { QuizQuestionOption } from '../actions';
import { Plus, Trash2 } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export type SubmitData = {
  category_id: string;
  statement: string;
  options: QuizQuestionOption[];
  explanation: string;
  status: 'draft' | 'published';
};

type Props = {
  categories: { id: string; name: string }[];
  initialStatement?: string;
  initialOptions?: QuizQuestionOption[];
  initialExplanation?: string;
  initialCategoryId?: string;
  initialStatus?: 'draft' | 'published';
  submitLabel: string;
  onSubmit: (data: SubmitData & { id?: string }) => Promise<unknown>;
  onCancel: () => void;
  successRedirect?: string;
  editId?: string;
};

export function QuestionForm({
  categories,
  initialStatement = '',
  initialOptions = [
    { letter: 'A', text: '', is_correct: false },
    { letter: 'B', text: '', is_correct: false },
    { letter: 'C', text: '', is_correct: false },
    { letter: 'D', text: '', is_correct: false },
  ],
  initialExplanation = '',
  initialCategoryId = '',
  initialStatus = 'draft',
  submitLabel,
  onSubmit,
  onCancel,
  successRedirect = '/admin/simulados/perguntas',
  editId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState(initialCategoryId || (categories[0]?.id ?? ''));
  const [statement, setStatement] = useState(initialStatement);
  const [options, setOptions] = useState<QuizQuestionOption[]>(
    initialOptions.length >= 2
      ? initialOptions
      : [
          { letter: 'A', text: '', is_correct: false },
          { letter: 'B', text: '', is_correct: false },
          { letter: 'C', text: '', is_correct: false },
          { letter: 'D', text: '', is_correct: false },
        ]
  );
  const [explanation, setExplanation] = useState(initialExplanation);
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);

  const setOptionCorrect = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, is_correct: i === index }))
    );
  };

  const updateOptionText = (index: number, text: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, text } : opt))
    );
  };

  const addOption = () => {
    if (options.length >= LETTERS.length) return;
    const used = new Set(options.map((o) => o.letter));
    const nextLetter = LETTERS.find((l) => !used.has(l));
    if (nextLetter)
      setOptions((prev) => [...prev, { letter: nextLetter, text: '', is_correct: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const wasCorrect = options[index].is_correct;
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (wasCorrect && next.length > 0) next[0].is_correct = true;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const st = statement.trim();
    if (!st) {
      setError('Enunciado é obrigatório.');
      return;
    }
    const opts = options.filter((o) => o.text.trim());
    if (opts.length < 2) {
      setError('Adicione pelo menos 2 alternativas com texto.');
      return;
    }
    const hasCorrect = opts.some((o) => o.is_correct);
    if (!hasCorrect) {
      setError('Marque a alternativa correta.');
      return;
    }
    if (!explanation.trim()) {
      setError('Explicação da resposta correta é obrigatória.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        ...(editId ? { id: editId } : {}),
        category_id: categoryId,
        statement: st,
        options: opts,
        explanation: explanation.trim(),
        status,
      });
      router.push(successRedirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
      )}

      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Categoria
        </label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Enunciado
        </label>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Texto da pergunta..."
          className="flex min-h-[100px] w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Alternativas (marque a correta)
          </label>
          {options.length < LETTERS.length && (
            <Button type="button" variant="ghost" size="sm" onClick={addOption}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={opt.is_correct}
                onChange={() => setOptionCorrect(index)}
                className="rounded-full border-[hsl(var(--input))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--ring))]"
              />
              <span className="w-6 text-sm font-medium text-[hsl(var(--muted-foreground))] shrink-0">
                {opt.letter})
              </span>
              <Input
                value={opt.text}
                onChange={(e) => updateOptionText(index, e.target.value)}
                placeholder={`Texto da alternativa ${opt.letter}`}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-[hsl(var(--destructive))]"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Explicação da resposta correta
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Por que a resposta correta é a correta..."
          className="flex min-h-[80px] w-full rounded-md border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Status
        </label>
        <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'published')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
