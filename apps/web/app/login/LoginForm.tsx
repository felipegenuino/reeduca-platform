'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap } from 'lucide-react';

function safeRedirect(path: string): string {
  if (!path || !path.startsWith('/') || path.includes('//')) return '/dashboard';
  return path;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirectTo') ?? '/dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Digite seu e-mail.');
      return;
    }
    if (!password) {
      setError('Digite sua senha.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) {
        setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const urlError = searchParams.get('error');
  const displayError = error || (urlError ? decodeURIComponent(urlError) : null);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 text-[hsl(var(--foreground))]"
        >
          <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <span className="font-semibold text-lg">Reeduca Fisio</span>
        </Link>

        {/* Card */}
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Entrar
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Acesse sua conta para continuar estudando.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {displayError && (
              <div
                className="rounded-md border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/10 px-3 py-2 text-sm text-[hsl(var(--destructive))]"
                role="alert"
              >
                {displayError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder="••••••••"
                disabled={loading}
              />
              <Link
                href="/auth/esqueci-senha"
                className="mt-1.5 inline-block text-xs font-medium text-[hsl(var(--primary))] hover:underline"
              >
                Esqueci a senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="font-medium text-[hsl(var(--primary))] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
          <Link href="/" className="hover:underline">
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
