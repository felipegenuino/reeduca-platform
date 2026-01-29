import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User, Mail, Shield, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { EditNameForm } from './EditNameForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { AvatarUpload } from './AvatarUpload';

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    student: 'Aluno',
    instructor: 'Instrutor',
    admin: 'Administrador',
  };
  return labels[role] ?? role;
}

function subscriptionLabel(status: string | null) {
  if (!status) return '—';
  const labels: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    trial: 'Período de teste',
  };
  return labels[status] ?? status;
}

export default async function PerfilPage() {
  const current = await getCurrentUser();
  
  if (!current) {
    redirect('/login?redirectTo=' + encodeURIComponent('/dashboard/perfil'));
  }
  
  const { user, profile } = current;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          Meu Perfil
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Dados da sua conta e opções de segurança.
        </p>
      </div>

      {/* Dados pessoais */}
      <section>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Dados pessoais
            </h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0 overflow-hidden">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name || 'Avatar'}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
                )}
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Nome</p>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {profile.name || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                <Mail className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">E-mail</p>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {user.email ?? '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                <Shield className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Tipo de conta</p>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {roleLabel(profile.role)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                <CreditCard className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Assinatura</p>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {subscriptionLabel(profile.subscription_status)}
                </p>
              </div>
            </div>

            <EditNameForm initialName={profile.name ?? ''} />
            <AvatarUpload currentAvatarUrl={profile.avatar_url} userId={user.id} />
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Segurança
            </h2>
          </div>
          <div className="px-5 py-4">
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}
