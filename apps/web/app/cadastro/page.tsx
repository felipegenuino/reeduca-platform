'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap } from 'lucide-react';

const MIN_PASSWORD_LENGTH = 8;

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Digite seu nome.');
      return;
    }
    if (!email.trim()) {
      setError('Digite seu e-mail.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim() } },
      });
      if (err) {
        setError(err.message);
        return;
      }
      // Supabase pode exigir confirmação de e-mail; nesse caso o usuário não entra direto
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[400px] rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Confirme seu e-mail
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
            Enviamos um link de confirmação para <strong>{email}</strong>. Abra o e-mail e clique no link para ativar sua conta.
          </p>
          <Link
            href="/entrar"
            className="mt-5 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150"
          >
            Entrar
          </Link>
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
            Criar conta
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Preencha os dados para acessar os cursos.
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
              <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">
                Nome
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder="Seu nome"
                disabled={loading}
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-0"
                placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
            >
              {loading ? 'Criando conta…' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Já tem conta?{' '}
            <Link href="/entrar" className="font-medium text-[hsl(var(--primary))] hover:underline">
              Entrar
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
