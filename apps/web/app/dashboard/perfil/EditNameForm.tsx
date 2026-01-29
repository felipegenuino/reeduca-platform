'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function EditNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Digite seu nome.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Sessão expirada. Faça login novamente.');
        return;
      }
      const { error: err } = await supabase
        .from('profiles')
        .update({ name: trimmed } as never)
        .eq('user_id', user.id);
      if (err) {
        setError(err.message);
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-3 border-t border-[hsl(var(--border))] space-y-3">
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
          Editar nome
        </label>
        <div className="flex gap-2">
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
            placeholder="Seu nome"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-[hsl(var(--success))]">
          Nome atualizado.
        </p>
      )}
    </form>
  );
}
