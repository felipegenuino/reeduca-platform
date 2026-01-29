import {
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@reeduca/ui';
import {
  Activity,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Heart,
  Stethoscope,
  Target,
  TrendingUp,
} from 'lucide-react';

export default function KitchensinkPage() {
  return (
    <div className="space-y-10">
      {/* Título de página — system: text-xl font-semibold tracking-tight */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Design System — Kitchensink
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Referência visual do Reeduca Fisio: paleta, tipografia, componentes e padrões do
          system.md.
        </p>
      </div>

      {/* 1. Paleta */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Paleta</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { token: 'background', label: 'Background' },
              { token: 'foreground', label: 'Foreground' },
              { token: 'card', label: 'Card' },
              { token: 'primary', label: 'Primary' },
              { token: 'secondary', label: 'Secondary' },
              { token: 'muted', label: 'Muted' },
              { token: 'accent', label: 'Accent' },
              { token: 'border', label: 'Border' },
              { token: 'destructive', label: 'Destructive' },
              { token: 'success', label: 'Success' },
              { token: 'warning', label: 'Warning' },
              { token: 'sidebar', label: 'Sidebar' },
            ].map(({ token, label }) => (
              <div key={token} className="space-y-1.5">
                <div
                  className="h-12 rounded-md border border-[hsl(var(--border))]"
                  style={{ backgroundColor: `hsl(var(--${token}))` }}
                />
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Tipografia */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Tipografia</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 space-y-4">
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Título de página — text-xl font-semibold tracking-tight
            </p>
            <p className="text-xl font-semibold tracking-tight">
              Avaliação Respiratória em UTI
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Subtítulo / descrição — text-sm text-muted-foreground
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Conteúdo teórico e prático para atuação em terapia intensiva.
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Título de card — text-sm font-semibold
            </p>
            <p className="text-sm font-semibold">Competências clínicas</p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Corpo — text-sm font-medium
            </p>
            <p className="text-sm font-medium">
              O fisioterapeuta deve realizar a avaliação respiratória no primeiro
              contato e reassessar conforme protocolo.
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Metadata — text-xs text-muted-foreground
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Atualizado em 28/01/2025 · 12 módulos
            </p>
          </div>
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Dados numéricos — tabular-nums
            </p>
            <p className="text-lg font-semibold tabular-nums">87%</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] tabular-nums">
              3 de 10 · 12h 45min
            </p>
          </div>
        </div>
      </section>

      {/* 3. Botões */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Botões</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Pequeno</Button>
            <Button size="lg">Grande</Button>
            <Button disabled>Desabilitado</Button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Botão primary inline (system):{' '}
            <code className="rounded bg-[hsl(var(--muted))] px-1 py-0.5 text-[11px]">
              gap-1.5 px-3.5 py-2 rounded-md bg-primary text-primary-foreground text-sm
              font-medium
            </code>
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150"
          >
            Ver curso <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 4. Card padrão */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Card padrão</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="border-b border-[hsl(var(--border))] px-5 py-3.5 flex items-center justify-between">
            <span className="text-sm font-semibold">Módulos do curso</span>
            <a
              href="#"
              className="text-xs font-medium text-[hsl(var(--primary))] hover:underline"
            >
              Ver todos
            </a>
          </div>
          <div className="px-5 py-4 space-y-3">
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Conteúdo do card: padding px-5 py-4. Header com border-b e título text-sm
              font-semibold; link de ação text-xs font-medium text-primary.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Métricas inline */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Métricas inline</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-lg font-semibold">12</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Módulos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums">87%</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Concluído
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums">4h 20min</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Tempo restante
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Barras de progresso */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Barras de progresso</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(var(--primary))]"
                style={{ width: '60%' }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums">60%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(var(--primary))]"
                style={{ width: '100%' }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums">100%</span>
          </div>
        </div>
      </section>

      {/* 7. Competências clínicas (assinatura) */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Competências clínicas</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="border-b border-[hsl(var(--border))] px-5 py-3.5">
            <span className="text-sm font-semibold">Progresso por competência</span>
          </div>
          <div className="divide-y divide-[hsl(var(--border))]">
            {[
              {
                name: 'Avaliação Respiratória',
                status: 'Avançado',
                statusClass: 'text-[hsl(var(--success))]',
                value: 100,
                icon: Stethoscope,
              },
              {
                name: 'Ventilação Mecânica',
                status: 'Intermediário',
                statusClass: 'text-[hsl(var(--primary))]',
                value: 65,
                icon: Activity,
              },
              {
                name: 'Monitorização Hemodinâmica',
                status: 'Em desenvolvimento',
                statusClass: 'text-[hsl(var(--warning))]',
                value: 30,
                icon: Heart,
              },
              {
                name: 'Mobilização Precoce',
                status: 'Iniciante',
                statusClass: 'text-[hsl(var(--muted-foreground))]',
                value: 0,
                icon: Target,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="px-5 py-4 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className={cn('text-xs font-medium', item.statusClass)}>
                    {item.status}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-24">
                  <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden min-w-[60px]">
                    <div
                      className="h-full rounded-full bg-[hsl(var(--primary))]"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-8">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Badges / Status */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Badges e status</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Avançado</Badge>
            <Badge variant="warning">Em desenvolvimento</Badge>
          </div>
        </div>
      </section>

      {/* 9. Controles */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Controles</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input</label>
            <Input placeholder="Digite aqui..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Opção A</SelectItem>
                <SelectItem value="b">Opção B</SelectItem>
                <SelectItem value="c">Opção C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* 10. Sidebar (referência) */}
      <section className="space-y-6">
        <h2 className="text-base font-semibold">Sidebar — referência de estados</h2>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4">
          <div className="max-w-[220px] space-y-0.5">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--accent-foreground))] text-sm font-medium">
              <ClipboardList className="w-[18px] h-[18px] shrink-0" />
              Link ativo
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md text-[hsl(var(--sidebar-muted))] text-sm font-medium">
              <BookOpen className="w-[18px] h-[18px] shrink-0" />
              Link inativo
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
