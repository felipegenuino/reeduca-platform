import Link from 'next/link';
import { CreateCategoryForm } from '../components/CreateCategoryForm';
import { Button } from '@reeduca/ui';
import { ArrowLeft } from 'lucide-react';

export default function NovaCategoriaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/simulados/categorias">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Nova categoria
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Preencha os dados da categoria.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-xl">
        <CreateCategoryForm />
      </div>
    </div>
  );
}
