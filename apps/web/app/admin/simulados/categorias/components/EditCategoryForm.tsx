'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@reeduca/ui';
import { updateCategory } from '../actions';

type Props = {
  id: string;
  initialName: string;
  initialSlug: string;
  initialDescription: string;
  initialSortOrder: number;
};

export function EditCategoryForm({
  id,
  initialName,
  initialSlug,
  initialDescription,
  initialSortOrder,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [description, setDescription] = useState(initialDescription);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateCategory(id, {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        sort_order: sortOrder,
      });
      router.push('/admin/simulados/categorias');
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
          Nome
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Fisioterapia Respiratória"
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
          placeholder="fisioterapia-respiratoria"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Descrição (opcional)
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição da categoria"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">
          Ordem
        </label>
        <Input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/simulados/categorias')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
