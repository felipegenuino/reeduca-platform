import Link from 'next/link';
import { CreateConjuntoForm } from '../components/CreateConjuntoForm';
import { Button } from '@reeduca/ui';
import { ArrowLeft } from 'lucide-react';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function NovoConjuntoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/simulados/conjuntos">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Novo conjunto
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Crie um simulado e depois adicione perguntas.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-xl">
        <CreateConjuntoForm slugify={slugify} />
      </div>
    </div>
  );
}
