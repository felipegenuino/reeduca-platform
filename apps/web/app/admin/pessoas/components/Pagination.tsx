'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@reeduca/ui';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

export function Pagination({ page, pageSize, total }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set('page', String(newPage));
    } else {
      params.delete('page');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        {total} {total === 1 ? 'pessoa' : 'pessoas'} encontrada{total !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        <span className="text-sm text-[hsl(var(--muted-foreground))] tabular-nums px-2">
          {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
