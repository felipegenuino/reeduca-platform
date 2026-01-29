import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Mail, Calendar, Clock, Hash } from 'lucide-react';
import { Badge } from '@reeduca/ui';
import { fetchUserDetail } from './actions';
import { EditRoleForm } from './components/EditRoleForm';
import { DeactivateUserButton } from './components/DeactivateUserButton';
import {
  roleLabel,
  roleBadgeVariant,
  subscriptionLabel,
  statusBadgeVariant,
  formatDateTime,
} from '../../lib/labels';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user;
  try {
    user = await fetchUserDetail(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pessoas"
          className="flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Pessoas
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt=""
            width={56}
            height={56}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            {user.name ?? 'Sem nome'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={roleBadgeVariant(user.role)}>
              {roleLabel(user.role)}
            </Badge>
            <Badge variant={statusBadgeVariant(user.subscription_status)}>
              {subscriptionLabel(user.subscription_status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Dados do usuário
          </h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow
            icon={Hash}
            label="ID"
            value={user.user_id}
            mono
          />
          <InfoRow
            icon={Calendar}
            label="Conta criada em"
            value={formatDateTime(user.created_at)}
          />
          {user.last_sign_in_at && (
            <InfoRow
              icon={Clock}
              label="Último acesso"
              value={formatDateTime(user.last_sign_in_at)}
            />
          )}
        </div>
      </div>

      {/* Role & Status Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Papel e assinatura
          </h2>
        </div>
        <div className="px-5 py-4">
          <EditRoleForm
            profileId={user.id}
            currentRole={user.role}
            currentStatus={user.subscription_status}
          />
        </div>
      </div>

      {/* Actions Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Ações
          </h2>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                Desativar conta
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                O status da assinatura será alterado para inativo.
              </p>
            </div>
            <DeactivateUserButton
              profileId={user.id}
              userName={user.name}
              isAlreadyInactive={user.subscription_status === 'inactive'}
            />
          </div>
        </div>
      </div>

      {/* Metadata Card (if exists) */}
      {user.metadata != null ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="px-5 py-3.5 border-b border-[hsl(var(--border))]">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              Metadados
            </h2>
          </div>
          <div className="px-5 py-4">
            <pre className="text-xs font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] rounded-md p-3 overflow-x-auto">
              {JSON.stringify(user.metadata, null, 2)}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))] mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
        <p
          className={`text-sm text-[hsl(var(--foreground))] ${mono ? 'font-mono text-xs' : ''} break-all`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
