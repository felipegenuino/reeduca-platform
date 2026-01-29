'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap } from 'lucide-react';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
        return;
      }
      setDone(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[400px] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Senha alterada
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
            Sua senha foi redefinida. Redirecionando para o dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 text-[hsl(var(--foreground))]"
        >
          <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <span className="font-semibold text-lg">Reeduca Fisio</span>
        </Link>

        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Nova senha
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Defina uma nova senha para sua conta.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div
                className="rounded-md border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/10 px-3 py-2 text-sm text-[hsl(var(--destructive))]"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Confirmar senha
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder="Repita a senha"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
            >
              {loading ? 'Salvando…' : 'Salvar senha'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
            <Link href="/entrar" className="font-medium text-[hsl(var(--primary))] hover:underline">
              Voltar ao entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
