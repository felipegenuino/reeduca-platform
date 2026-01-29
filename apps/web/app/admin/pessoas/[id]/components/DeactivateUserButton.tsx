'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@reeduca/ui';
import { Loader2, Ban } from 'lucide-react';
import { deactivateUser } from '../actions';

interface DeactivateUserButtonProps {
  profileId: string;
  userName: string | null;
  isAlreadyInactive: boolean;
}

export function DeactivateUserButton({
  profileId,
  userName,
  isAlreadyInactive,
}: DeactivateUserButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleDeactivate = () => {
    setError('');
    startTransition(async () => {
      try {
        await deactivateUser(profileId);
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao desativar usuário.');
      }
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isAlreadyInactive}
      >
        <Ban className="w-4 h-4" />
        {isAlreadyInactive ? 'Usuário já inativo' : 'Desativar usuário'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desativar{' '}
              <strong>{userName ?? 'este usuário'}</strong>? O status da
              assinatura será alterado para inativo.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Ban className="w-4 h-4" />
              )}
              Desativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
