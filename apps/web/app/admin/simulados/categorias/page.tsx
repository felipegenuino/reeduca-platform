import Link from 'next/link';
import { fetchCategories } from './actions';
import { Button } from '@reeduca/ui';
import { Plus, Pencil } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@reeduca/ui';

export default async function CategoriasPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Categorias
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Organize as categorias das perguntas do simulado.
          </p>
        </div>
        <Link href="/admin/simulados/categorias/nova">
          <Button className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova categoria
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-12 text-center">
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            Nenhuma categoria ainda
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Crie uma categoria para começar a cadastrar perguntas.
          </p>
          <Link href="/admin/simulados/categorias/nova" className="mt-4 inline-block">
            <Button>Nova categoria</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                <TableHead className="w-[80px] text-right">Ordem</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-[hsl(var(--muted-foreground))] text-sm">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-[hsl(var(--muted-foreground))] max-w-[200px] truncate">
                    {cat.description || '—'}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {cat.sort_order}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/simulados/categorias/${cat.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
