'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
} from '@reeduca/ui';
import type { UserWithEmail } from '../actions';
import {
  roleLabel,
  subscriptionLabel,
  roleBadgeVariant,
  statusBadgeVariant,
  formatDate,
} from '../../lib/labels';
import { Pagination } from './Pagination';

interface UsersTableProps {
  users: UserWithEmail[];
  total: number;
  page: number;
  pageSize: number;
}

export function UsersTable({ users, total, page, pageSize }: UsersTableProps) {
  const router = useRouter();

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-12 text-center">
        <User className="w-10 h-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
          Nenhuma pessoa encontrada
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          Tente ajustar os filtros ou a busca.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Pessoa</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/pessoas/${user.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                      {user.name ?? 'Sem nome'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant(user.role)}>
                    {roleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={statusBadgeVariant(user.subscription_status)}>
                    {subscriptionLabel(user.subscription_status)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-right">
                  <span className="text-xs text-[hsl(var(--muted-foreground))] tabular-nums">
                    {formatDate(user.created_at)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
