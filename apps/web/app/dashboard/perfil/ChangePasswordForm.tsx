'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

const MIN_PASSWORD_LENGTH = 8;

export function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) {
        setError(err.message);
        return;
      }
      setSuccess(true);
      setNewPassword('');
      setConfirm('');
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
          Nova senha
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
          placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
          Confirmar nova senha
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
          placeholder="Repita a nova senha"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Alterar senha'}
      </button>
      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-[hsl(var(--success))]">
          Senha alterada com sucesso.
        </p>
      )}
    </form>
  );
}
