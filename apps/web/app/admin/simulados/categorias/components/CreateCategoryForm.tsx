'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@reeduca/ui';
import { createCategory } from '../actions';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CreateCategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!slug || slug === slugify(name)) setSlug(slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createCategory({
        name: name.trim(),
        slug: (slug || slugify(name)).trim().toLowerCase(),
        description: description.trim() || undefined,
        sort_order: sortOrder,
      });
      router.push('/admin/simulados/categorias');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria.');
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
          onChange={handleNameChange}
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
          {loading ? 'Salvando...' : 'Criar categoria'}
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
