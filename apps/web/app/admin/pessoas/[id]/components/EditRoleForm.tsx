'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@reeduca/ui';
import { Loader2, Save } from 'lucide-react';
import { updateUserRole, updateSubscriptionStatus } from '../actions';

interface EditRoleFormProps {
  profileId: string;
  currentRole: 'cadastrado' | 'student' | 'instructor' | 'admin';
  currentStatus: 'active' | 'inactive' | 'trial' | null;
}

export function EditRoleForm({
  profileId,
  currentRole,
  currentStatus,
}: EditRoleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState(currentStatus ?? 'null');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [pendingRole, setPendingRole] = useState<'cadastrado' | 'student' | 'instructor' | 'admin' | null>(null);

  const hasChanges =
    role !== currentRole || status !== (currentStatus ?? 'null');

  const handleRoleChange = (value: string) => {
    const newRole = value as 'cadastrado' | 'student' | 'instructor' | 'admin';
    // Confirm when changing to/from admin
    if (newRole === 'admin' || currentRole === 'admin') {
      setPendingRole(newRole);
      setShowAdminConfirm(true);
    } else {
      setRole(newRole);
    }
  };

  const confirmRoleChange = () => {
    if (pendingRole) {
      setRole(pendingRole);
      setPendingRole(null);
    }
    setShowAdminConfirm(false);
  };

  const cancelRoleChange = () => {
    setPendingRole(null);
    setShowAdminConfirm(false);
  };

  const handleSave = () => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        if (role !== currentRole) {
          await updateUserRole(profileId, role);
        }

        const newStatus = status === 'null' ? null : (status as 'active' | 'inactive' | 'trial');
        if (newStatus !== currentStatus) {
          await updateSubscriptionStatus(profileId, newStatus);
        }

        setSuccess('Alterações salvas com sucesso.');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar alterações.');
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Papel
            </label>
            <Select value={role} onValueChange={handleRoleChange}>
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Status da assinatura
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="trial">Teste</SelectItem>
                <SelectItem value="null">Sem assinatura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
        )}
        {success && (
          <p className="text-sm text-[hsl(var(--success))]">{success}</p>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            size="sm"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar alterações
          </Button>
        </div>
      </div>

      <Dialog open={showAdminConfirm} onOpenChange={setShowAdminConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar papel para {pendingRole === 'admin' ? 'Administrador' : pendingRole === 'instructor' ? 'Instrutor' : pendingRole === 'student' ? 'Aluno' : 'Cadastrado'}?</DialogTitle>
            <DialogDescription>
              {pendingRole === 'admin'
                ? 'Administradores têm acesso total ao painel de gerenciamento da plataforma. Tem certeza?'
                : currentRole === 'admin'
                  ? 'Este usuário perderá acesso ao painel administrativo. Tem certeza?'
                  : 'Esta ação alterará as permissões do usuário.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" onClick={cancelRoleChange}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={confirmRoleChange}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
