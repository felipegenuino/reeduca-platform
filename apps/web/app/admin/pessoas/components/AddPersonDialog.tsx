'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reeduca/ui';
import { UserPlus } from 'lucide-react';
import { createUser, type CreateUserInput } from '../actions';

export function AddPersonDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CreateUserInput>({
    email: '',
    password: '',
    name: '',
    role: 'cadastrado',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser({
        email: form.email,
        password: form.password,
        name: form.name?.trim() || undefined,
        role: form.role,
      });
      setOpen(false);
      setForm({ email: '', password: '', name: '', role: 'cadastrado' });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pessoa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="w-4 h-4" />
          Adicionar pessoa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar pessoa</DialogTitle>
          <DialogDescription>
            Crie um novo usuário com e-mail e senha. Ele poderá acessar a plataforma imediatamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="add-email" className="text-sm font-medium text-[hsl(var(--foreground))]">
              E-mail *
            </label>
            <Input
              id="add-email"
              type="email"
              required
              placeholder="nome@exemplo.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="add-password" className="text-sm font-medium text-[hsl(var(--foreground))]">
              Senha * (mín. 6 caracteres)
            </label>
            <Input
              id="add-password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="add-name" className="text-sm font-medium text-[hsl(var(--foreground))]">
              Nome
            </label>
            <Input
              id="add-name"
              type="text"
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Papel
            </label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm((p) => ({ ...p, role: v as CreateUserInput['role'] }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cadastrado">Cadastrado</SelectItem>
                <SelectItem value="student">Aluno</SelectItem>
                <SelectItem value="instructor">Instrutor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-[hsl(var(--destructive))]" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando…' : 'Criar pessoa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
