import {
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  Wind,
  Activity,
  ArrowUpRight,
  BookMarked,
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

/* ── Dados mockados ─────────────────────────────────────── */

const aluno = {
  nome: 'Ana',
  cursosAtivos: 2,
  horasEstudadas: 34,
  certificados: 1,
};

const cursoEmAndamento = {
  id: '1',
  titulo: 'Ventilação Mecânica na UTI',
  professora: 'Dra. Kelly Cattelan',
  moduloAtual: 'Módulo 4 — Modos Ventilatórios',
  aulaAtual: 'Ventilação com Pressão de Suporte',
  progressoGeral: 62,
  duracaoRestante: '~4h restantes',
  ultimoAcesso: 'Há 2 dias',
};

const competencias = [
  {
    nome: 'Avaliação Respiratória',
    icon: Wind,
    nivel: 85,
    status: 'Avançado' as const,
  },
  {
    nome: 'Ventilação Mecânica',
    icon: Activity,
    nivel: 62,
    status: 'Intermediário' as const,
  },
  {
    nome: 'Monitorização Hemodinâmica',
    icon: HeartPulse,
    nivel: 40,
    status: 'Em desenvolvimento' as const,
  },
  {
    nome: 'Mobilização Precoce',
    icon: Stethoscope,
    nivel: 20,
    status: 'Iniciante' as const,
  },
];

const cursosDisponiveis = [
  {
    id: '2',
    titulo: 'Fisioterapia Cardiorrespiratória',
    professora: 'Dra. Katerine Bernhardi',
    modulos: 8,
    duracao: '12h',
    nivel: 'Intermediário',
  },
  {
    id: '3',
    titulo: 'Mobilização Precoce em UTI',
    professora: 'Dra. Kelly Cattelan',
    modulos: 6,
    duracao: '8h',
    nivel: 'Avançado',
  },
];

/* ── Helpers ──────────────────────────────────────────── */

function statusColor(status: string) {
  switch (status) {
    case 'Avançado':
      return 'text-[hsl(var(--success))]';
    case 'Intermediário':
      return 'text-[hsl(var(--primary))]';
    case 'Em desenvolvimento':
      return 'text-[hsl(var(--warning))]';
    default:
      return 'text-[hsl(var(--muted-foreground))]';
  }
}

function progressWidth(value: number) {
  return { width: `${value}%` } as const;
}

/* ── Componentes ──────────────────────────────────────── */

function MetricInline({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof BookOpen;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
        <Icon className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
      </div>
      <div>
        <div className="text-lg font-semibold leading-tight text-[hsl(var(--foreground))]">
          {value}
        </div>
        <div className="text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
      </div>
    </div>
  );
}

function CompetenciaItem({
  competencia,
}: {
  competencia: (typeof competencias)[0];
}) {
  const Icon = competencia.icon;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
            {competencia.nome}
          </span>
          <span className={`text-xs font-medium shrink-0 ml-2 ${statusColor(competencia.status)}`}>
            {competencia.status}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500"
            style={progressWidth(competencia.nivel)}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Página ────────────────────────────────────────────── */

export default async function DashboardPage() {
  const current = await getCurrentUser();
  if (!current) redirect('/entrar?redirectTo=' + encodeURIComponent('/dashboard'));

  const { profile } = current;
  const name = profile.name?.trim() || 'você';
  const isCadastrado = profile.role === 'cadastrado';

  if (isCadastrado) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-[hsl(var(--foreground))] tracking-tight">
            Olá, {name}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            Sua conta está ativa. Ainda não há cursos na sua conta — explore o catálogo e compre seu primeiro curso para começar a estudar.
          </p>
        </div>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
          <BookMarked className="w-12 h-12 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))] mb-2">
            Nenhum curso ainda
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5 max-w-sm mx-auto">
            Quando você comprar um curso ou e-book, ele aparecerá aqui e no menu.
          </p>
          <Link
            href="/#cursos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Explorar catálogo
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saudação + métricas inline */}
      <div>
        <h1 className="text-xl font-semibold text-[hsl(var(--foreground))] tracking-tight">
          Olá, {aluno.nome}
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Continue de onde parou — cada módulo te aproxima da prática clínica.
        </p>
      </div>

      <div className="flex flex-wrap gap-6">
        <MetricInline label="Cursos ativos" value={aluno.cursosAtivos} icon={BookOpen} />
        <MetricInline label="Horas estudadas" value={`${aluno.horasEstudadas}h`} icon={Clock} />
        <MetricInline label="Certificados" value={aluno.certificados} icon={CheckCircle2} />
      </div>

      {/* Continuar estudando — card destaque */}
      <section>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <div className="px-5 py-4 border-b border-[hsl(var(--border))]">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
                  {cursoEmAndamento.titulo}
                </h2>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {cursoEmAndamento.professora} · {cursoEmAndamento.ultimoAcesso}
                </p>
              </div>
              <Link
                href={`/dashboard/cursos/${cursoEmAndamento.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                Continuar
              </Link>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div>
              <p className="text-sm text-[hsl(var(--foreground))]">
                {cursoEmAndamento.moduloAtual}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Próxima aula: {cursoEmAndamento.aulaAtual}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500"
                  style={progressWidth(cursoEmAndamento.progressoGeral)}
                />
              </div>
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] tabular-nums shrink-0">
                {cursoEmAndamento.progressoGeral}%
              </span>
            </div>

            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {cursoEmAndamento.duracaoRestante}
            </p>
          </div>
        </div>
      </section>

      {/* Duas colunas: Competências + Cursos disponíveis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competências clínicas */}
        <section>
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="px-5 py-3.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Competências Clínicas
              </h2>
              <Link
                href="/dashboard/progresso"
                className="text-xs font-medium text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-0.5"
              >
                Ver detalhes
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="px-5 py-1 divide-y divide-[hsl(var(--border))]">
              {competencias.map((c) => (
                <CompetenciaItem key={c.nome} competencia={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Cursos para explorar */}
        <section>
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="px-5 py-3.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Explorar Cursos
              </h2>
              <Link
                href="/dashboard/cursos"
                className="text-xs font-medium text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-0.5"
              >
                Ver todos
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {cursosDisponiveis.map((curso) => (
                <Link
                  key={curso.id}
                  href={`/dashboard/cursos/${curso.id}`}
                  className="block px-5 py-4 hover:bg-[hsl(var(--accent))]/40 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-medium text-[hsl(var(--foreground))] leading-snug">
                        {curso.titulo}
                      </h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {curso.professora}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {curso.modulos} módulos
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {curso.duracao}
                        </span>
                        <span className="text-xs font-medium text-[hsl(var(--primary))]">
                          {curso.nivel}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
