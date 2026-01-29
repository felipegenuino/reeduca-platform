'use client';

import { useRef, useState } from 'react';
import {
  Wind,
  Activity,
  Stethoscope,
  BookMarked,
  Droplets,
  Brain,
  Gauge,
  Scale,
} from 'lucide-react';

const SECTIONS = [
  { id: 'gasometria', label: 'Gasometria', icon: Droplets },
  { id: 'glasgow', label: 'Escala de Glasgow', icon: Brain },
  { id: 'rass', label: 'Escala RASS', icon: Gauge },
  { id: 'ramsay', label: 'Escala Ramsay', icon: Gauge },
  { id: 'borg', label: 'Escala Borg', icon: Scale },
  { id: 'tonus', label: 'Tônus muscular', icon: Activity },
  { id: 'mrc', label: 'Escore MRC', icon: Stethoscope },
] as const;

export default function GuiaDeBolsoPage() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-[hsl(var(--primary))]" />
          Guia de Bolso
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Avaliação fisioterapêutica respiratória e motora — Reabilitar · Núcleo de Fisioterapia · Comissão de Educação Continuada, 2014.
        </p>
      </div>

      {/* Navegação rápida */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-4 px-4 py-2 bg-[hsl(var(--background))]/95 backdrop-blur-sm border-b border-[hsl(var(--border))] lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0">
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2">
          <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] px-2 py-1 mb-1">
            Ir para
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:opacity-90 transition-opacity"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Gasometria */}
        <Section id="gasometria" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Gasometria" icon={Droplets}>
          <GuiaTable
            title="GASOMETRIA"
            cols={['Parâmetros', 'Valores normais']}
            rows={[
              ['pH', '7,35 a 7,45'],
              ['PaCO₂', '35 a 45 mmHg'],
              ['PaO₂', '80 a 100 mmHg'],
              ['HCO₃⁻', '22 a 26 mEq/L'],
              ['BE (Base Excess)', '+2 a -2 mEq/L'],
            ]}
          />
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4 mb-2">
            Distúrbios primários
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">PaCO₂:</span>
              <span className="text-[hsl(var(--muted-foreground))]">&lt; 35 mmHg</span>
              <span>→ Alcalose respiratória</span>
              <span className="text-[hsl(var(--muted-foreground))]">|</span>
              <span className="text-[hsl(var(--muted-foreground))]">&gt; 45 mmHg</span>
              <span>→ Acidose respiratória</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">HCO₃⁻:</span>
              <span className="text-[hsl(var(--muted-foreground))]">&lt; 22 mEq/L</span>
              <span>→ Acidose metabólica</span>
              <span className="text-[hsl(var(--muted-foreground))]">|</span>
              <span className="text-[hsl(var(--muted-foreground))]">&gt; 26 mEq/L</span>
              <span>→ Alcalose metabólica</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">BE:</span>
              <span className="text-[hsl(var(--muted-foreground))]">&lt; -2 mEq/L</span>
              <span>→ Acidose metabólica</span>
              <span className="text-[hsl(var(--muted-foreground))]">|</span>
              <span className="text-[hsl(var(--muted-foreground))]">&gt; +2 mEq/L</span>
              <span>→ Alcalose metabólica</span>
            </div>
          </div>
        </Section>

        {/* 2. Escala de Glasgow */}
        <Section id="glasgow" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Escala de Coma de Glasgow" icon={Brain}>
          <GuiaTable
            title="ESCALA DE COMA DE GLASGOW"
            cols={['Padrões de avaliação', 'Pontuação']}
            rows={[
              ['Abertura ocular', '—'],
              ['Espontânea, sem estímulo verbal ou doloroso', '4'],
              ['Ao comando verbal', '3'],
              ['Ao estímulo doloroso', '2'],
              ['Ausente', '1'],
              ['Resposta verbal', '—'],
              ['Orientado', '5'],
              ['Confuso (não responde às questões elaboradas)', '4'],
              ['Palavras inapropriadas (não mantém diálogo)', '3'],
              ['Sons incompreensíveis (gemidos)', '2'],
              ['Ausente', '1'],
              ['Resposta motora', '—'],
              ['Obedece a comandos', '6'],
              ['Localiza o estímulo doloroso', '5'],
              ['Retira o membro após estímulo doloroso', '4'],
              ['Decorticação (flexão patológica)', '3'],
              ['Descerebração (extensão patológica)', '2'],
              ['Ausente', '1'],
            ]}
            subheaderRows={[0, 5, 11]}
          />
          <GuiaTable
            title="Classificação do comprometimento (pontuação Glasgow)"
            cols={['Pontuação', 'Grau de comprometimento']}
            rows={[
              ['3 pontos', 'Menor responsividade'],
              ['4–8 pontos', 'Coma profundo'],
              ['9–12 pontos', 'Coma moderado'],
              ['13–15 pontos', 'Coma leve'],
            ]}
            className="mt-4"
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3">
            <strong>Padrão de decorticação:</strong> membros superiores em flexão (cotovelos, punhos e dedos junto ao tórax); membros inferiores em extensão e rotação interna.
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            <strong>Padrão de descerebração:</strong> membros superiores em extensão e pronação; membros inferiores em extensão com flexão plantar.
          </p>
        </Section>

        {/* 3. Escala RASS */}
        <Section id="rass" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Escala RASS" icon={Gauge}>
          <GuiaTable
            title="ESCALA DE RASS"
            cols={['Pontos', 'Classificação', 'Descrição']}
            rows={[
              ['+4', 'Agressivo', 'Violento; perigoso'],
              ['+3', 'Muito agitado', 'Conduta agressiva, remoção de tubos ou cateteres'],
              ['+2', 'Agitado', 'Movimentos sem coordenação frequentes'],
              ['+1', 'Inquieto', 'Ansioso, sem movimentos agressivos ou vigorosos'],
              ['0', 'Alerto, calmo', '—'],
              ['-1', 'Sonolento', 'Despertar sustentado ao som da voz (>10 s)'],
              ['-2', 'Sedação leve', 'Acorda rapidamente e faz contato visual com a voz (<10 s)'],
              ['-3', 'Sedação moderada', 'Movimento ou abertura dos olhos à voz (sem contato visual)'],
              ['-4', 'Sedação profunda', 'Não responde à voz; move/abre olhos com estímulo físico'],
              ['-5', 'Incapaz de ser despertado', 'Não responde à voz ou ao estímulo físico'],
            ]}
          />
        </Section>

        {/* 4. Escala Ramsay */}
        <Section id="ramsay" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Escala Ramsay" icon={Gauge}>
          <GuiaTable
            title="ESCALA DE RAMSAY"
            cols={['Grau', 'Descrição']}
            rows={[
              ['1', 'Ansioso, agitado'],
              ['2', 'Cooperativo, orientado, tranquilo'],
              ['3', 'Sonolento, atende aos comandos'],
              ['4', 'Dormindo, responde rapidamente ao estímulo glabelar ou sonoro vigoroso'],
              ['5', 'Dormindo, responde lentamente ao estímulo glabelar ou sonoro vigoroso'],
              ['6', 'Dormindo, sem resposta'],
            ]}
          />
        </Section>

        {/* 5. Escala Borg */}
        <Section id="borg" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Escala Borg" icon={Scale}>
          <GuiaTable
            title="ESCALA DE BORG"
            cols={['Valor', 'Descrição']}
            rows={[
              ['0', 'Nenhuma'],
              ['0,5', 'Muito, muito leve'],
              ['1', 'Muito leve'],
              ['2', 'Leve'],
              ['3', 'Moderada'],
              ['4', 'Pouco intensa'],
              ['5', 'Intensa'],
              ['6', 'Entre intensa e muito intensa'],
              ['7', 'Muito intensa'],
              ['8', 'Entre muito intensa e máxima'],
              ['9', 'Muito, muito intensa'],
              ['10', 'Máxima'],
            ]}
          />
        </Section>

        {/* 6. Distúrbios de tônus muscular */}
        <Section id="tonus" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Distúrbios de tônus muscular" icon={Activity}>
          <GuiaTable
            title="DISTÚRBIOS DE TÔNUS MUSCULAR"
            cols={['Termo', 'Definição']}
            rows={[
              [
                'Hipertonia',
                'Aumento da resistência ao movimento passivo das articulações. Divide-se em espasticidade (origem piramidal), rigidez (origem extrapiramidal) e contraturas antálgicas (rigidez meníngea, tetânica, etc.).',
              ],
              [
                'Hipotonia',
                'Diminuição da resistência ao movimento passivo das articulações.',
              ],
              [
                'Paratonia',
                'Deficiência no relaxamento voluntário. Associação à disfunção cerebral difusa, principalmente lobos frontais.',
              ],
            ]}
          />
        </Section>

        {/* 7. Escore MRC */}
        <Section id="mrc" sectionRefs={sectionRefs} activeSectionId={activeSectionId} onActivate={setActiveSectionId} title="Escore do Medical Research Council (MRC)" icon={Stethoscope}>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
            Movimentos avaliados: abdução do ombro, flexão do cotovelo, extensão do punho, flexão do quadril, extensão do joelho, dorsiflexão do tornozelo.
          </p>
          <GuiaTable
            title="GRAU DE FORÇA MUSCULAR (MRC)"
            cols={['Grau', 'Descrição']}
            rows={[
              ['0', 'Nenhuma contração visível'],
              ['1', 'Contração visível sem movimento do segmento'],
              ['2', 'Movimento ativo com eliminação da gravidade'],
              ['3', 'Movimento ativo contra gravidade'],
              ['4', 'Movimento ativo contra gravidade e resistência'],
              ['5', 'Força normal'],
            ]}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({
  id,
  sectionRefs,
  activeSectionId,
  onActivate,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  activeSectionId: string | null;
  onActivate: (id: string) => void;
  title: string;
  icon: typeof Wind;
  children: React.ReactNode;
}) {
  return (
    <section
      ref={(el) => { sectionRefs.current[id] = el; }}
      id={id}
      className="scroll-mt-24 lg:scroll-mt-6"
    >
      <GuiaSection
        title={title}
        icon={Icon}
        isActive={activeSectionId === id}
        onActivate={() => onActivate(id)}
      >
        {children}
      </GuiaSection>
    </section>
  );
}

function GuiaSection({
  title,
  icon: Icon,
  isActive,
  onActivate,
  children,
}: {
  title: string;
  icon: typeof Wind;
  isActive: boolean;
  onActivate: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); } }}
      className={`rounded-lg border overflow-hidden transition-[box-shadow,border-color,background-color] duration-150 outline-none ring-offset-2 ring-offset-[hsl(var(--background))] focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary))]/25 focus-within:border-[hsl(var(--primary))] focus-within:ring-2 focus-within:ring-[hsl(var(--primary))]/25 cursor-pointer ${
        isActive
          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent))]/30 ring-2 ring-[hsl(var(--primary))]/25'
          : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'
      }`}
    >
      <div className="px-5 py-3.5 border-b border-[hsl(var(--border))] flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-[hsl(var(--accent))] flex items-center justify-center shrink-0">
          <Icon className="w-[18px] h-[18px] text-[hsl(var(--accent-foreground))]" />
        </div>
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4 text-[hsl(var(--foreground))]">
        {children}
      </div>
    </div>
  );
}

function GuiaTable({
  title,
  cols,
  rows,
  subheaderRows,
  className = '',
}: {
  title: string;
  cols: string[];
  rows: (string | number)[][];
  subheaderRows?: number[];
  className?: string;
}) {
  const isSubheader = (i: number) => subheaderRows?.includes(i) ?? false;
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-[hsl(var(--primary))] mb-2 uppercase tracking-wide">
        {title}
      </p>
      <div className="overflow-x-auto rounded-md border border-[hsl(var(--border))]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--accent))]">
              {cols.map((c) => (
                <th
                  key={c}
                  className="px-3 py-2 text-left font-semibold text-[hsl(var(--accent-foreground))] border-b border-[hsl(var(--border))]"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={isSubheader(i) ? 'bg-[hsl(var(--muted))]/60 font-medium' : ''}
              >
                {isSubheader(i) ? (
                  <td
                    colSpan={cols.length}
                    className="px-3 py-2 border-b border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                  >
                    {row[0] ?? '—'}
                  </td>
                ) : (
                  row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-3 py-2 border-b border-[hsl(var(--border))] text-[hsl(var(--foreground))] last:tabular-nums"
                    >
                      {cell ?? '—'}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
