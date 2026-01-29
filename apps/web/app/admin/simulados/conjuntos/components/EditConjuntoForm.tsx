'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@reeduca/ui';
import { updateQuizSet } from '../actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@reeduca/ui';

type Props = {
  id: string;
  initialTitle: string;
  initialSlug: string;
  initialDescription: string;
  initialStatus: 'draft' | 'published';
  initialTimeLimitMinutes: number | null;
};

export function EditConjuntoForm({
  id,
  initialTitle,
  initialSlug,
  initialDescription,
  initialStatus,
  initialTimeLimitMinutes,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);
  const [timeLimit, setTimeLimit] = useState<string>(
    initialTimeLimitMinutes != null ? String(initialTimeLimitMinutes) : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateQuizSet(id, {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        status,
        time_limit_minutes: timeLimit ? parseInt(timeLimit, 10) : null,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
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
          onChange={(e) => setTitle(e.target.value)}
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
          {loading ? 'Salvando...' : 'Salvar'}
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
