'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useRef, useTransition } from 'react';
import { Search } from 'lucide-react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reeduca/ui';

interface UsersFiltersProps {
  currentSearch?: string;
  currentRole?: string;
  currentStatus?: string;
}

export function UsersFilters({
  currentSearch,
  currentRole,
  currentStatus,
}: UsersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      params.delete('page');
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams('q', value);
    }, 300);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <Input
          placeholder="Buscar por nome ou email..."
          defaultValue={currentSearch ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        defaultValue={currentRole ?? 'all'}
        onValueChange={(value) => updateParams('role', value)}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Papel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os papéis</SelectItem>
          <SelectItem value="cadastrado">Cadastrado</SelectItem>
          <SelectItem value="student">Aluno</SelectItem>
          <SelectItem value="instructor">Instrutor</SelectItem>
          <SelectItem value="admin">Administrador</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={currentStatus ?? 'all'}
        onValueChange={(value) => updateParams('status', value)}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
          <SelectItem value="trial">Teste</SelectItem>
          <SelectItem value="null">Sem assinatura</SelectItem>
        </SelectContent>
      </Select>

      {isPending && (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
