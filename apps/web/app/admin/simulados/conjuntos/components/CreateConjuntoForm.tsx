'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@reeduca/ui';
import { createQuizSet } from '../actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@reeduca/ui';

type Props = {
  slugify: (s: string) => string;
};

export function CreateConjuntoForm({ slugify }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [timeLimit, setTimeLimit] = useState<string>('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTitle(v);
    if (!slug || slug === slugify(title)) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { id } = await createQuizSet({
        title: title.trim(),
        slug: (slug || slugify(title)).trim().toLowerCase(),
        description: description.trim() || undefined,
        status,
        time_limit_minutes: timeLimit ? parseInt(timeLimit, 10) : null,
      });
      router.push(`/admin/simulados/conjuntos/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conjunto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
      )}
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Título
        </label>
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Ex.: Simulado Fisioterapia Respiratória"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Slug
        </label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="simulado-fisioterapia-respiratoria"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Descrição (opcional)
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição do simulado"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Tempo limite (minutos, opcional)
        </label>
        <Input
          type="number"
          min={0}
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          placeholder="Ex.: 60"
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
          {loading ? 'Criando...' : 'Criar conjunto'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/simulados/conjuntos')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
