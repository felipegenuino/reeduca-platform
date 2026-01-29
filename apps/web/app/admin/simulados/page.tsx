import Link from 'next/link';
import { FolderTree, ListChecks, Layers } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

const links = [
  {
    href: '/admin/simulados/categorias',
    label: 'Categorias',
    description: 'Organize as categorias das perguntas (ex.: Fisioterapia Respiratória, UTI).',
    icon: FolderTree,
  },
  {
    href: '/admin/simulados/perguntas',
    label: 'Perguntas',
    description: 'Cadastre enunciados, alternativas, resposta correta e explicação.',
    icon: ListChecks,
  },
  {
    href: '/admin/simulados/conjuntos',
    label: 'Conjuntos de desafio',
    description: 'Monte e publique simulados com as perguntas cadastradas.',
    icon: Layers,
  },
];

export default function AdminSimuladosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          Simulados
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Gerencie categorias, perguntas e conjuntos de desafio (simulados estilo concurso).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 flex items-start gap-4 hover:bg-[hsl(var(--accent))]/30 transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[hsl(var(--accent-foreground))]" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {item.label}
                </h2>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
