# Reeduca Fisio — Design System

## Direção: Clínico-Acolhedor

**Quem usa:** Fisioterapeutas em formação continuada — entre plantões, à noite em casa, no intervalo do hospital. Clínicos primeiro, não pessoas de tecnologia.

**O que fazem:** Continuar cursos, acompanhar competências clínicas, acessar certificados.

**Como deve parecer:** Acolhedor e profissional. Caderno de estudos organizado, não painel corporativo. Quente sem ser informal, preciso sem ser frio.

---

## Paleta

**Origem:** Mundo clínico — scrubs cirúrgicos (teal), papel de prontuário (creme), equipamentos médicos (cinza neutro quente).

### Light Mode
| Token | Valor HSL | Uso |
|---|---|---|
| `--background` | 40 20% 98% | Canvas base — creme levíssimo |
| `--foreground` | 200 15% 15% | Texto principal — escuro quente |
| `--card` | 40 15% 97% | Superfície de cards |
| `--primary` | 174 42% 40% | Teal clínico — acento principal |
| `--primary-foreground` | 40 20% 98% | Texto sobre primary |
| `--secondary` | 40 14% 93% | Superfície secundária |
| `--muted` | 40 10% 94% | Backgrounds sutis |
| `--muted-foreground` | 200 8% 50% | Texto terciário |
| `--accent` | 174 30% 93% | Teal diluído — hover, destaques |
| `--accent-foreground` | 174 42% 28% | Texto sobre accent |
| `--border` | 40 12% 90% | Bordas padrão — quase invisíveis |
| `--input` | 40 10% 91% | Borda de controles |
| `--destructive` | 0 65% 54% | Ações destrutivas |
| `--success` | 158 45% 42% | Status positivo |
| `--warning` | 38 80% 55% | Alerta |

### Sidebar
| Token | Valor HSL |
|---|---|
| `--sidebar` | 40 15% 96.5% |
| `--sidebar-border` | 40 12% 91% |
| `--sidebar-accent` | 174 30% 93% |
| `--sidebar-muted` | 200 8% 50% |

### Dark Mode
Mesma identidade, valores invertidos. Primary sobe para 48% luminosidade. Superfícies em azul-escuro quente (200 15% 7%).

---

## Profundidade

**Estratégia:** Bordas sutis (borders-only). Sem sombras dramáticas.

- Bordas em `hsl(var(--border))` — quase invisíveis, definem regiões sem competir
- Cards: `rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]`
- Sidebar separada do conteúdo por borda, mesmo fundo — não é uma região diferente

---

## Tipografia

**Família:** Geist Sans (variável `--font-geist-sans`), Geist Mono para dados.

**Hierarquia:**
- Título de página: `text-xl font-semibold tracking-tight`
- Subtítulo/descrição: `text-sm text-[hsl(var(--muted-foreground))]`
- Título de card: `text-base font-semibold` ou `text-sm font-semibold`
- Corpo: `text-sm font-medium`
- Metadata: `text-xs text-[hsl(var(--muted-foreground))]`
- Dados numéricos: `tabular-nums` para alinhamento

---

## Espaçamento

**Base:** 4px. Escala via Tailwind.

- Micro: `gap-0.5` (2px) — entre ícone e texto inline
- Componente: `px-3 py-2` (12px/8px) — nav links, botões
- Card padding: `px-5 py-4` (20px/16px)
- Card header: `px-5 py-3.5` (20px/14px)
- Seções: `space-y-6` (24px)
- Métricas: `gap-6` (24px) entre itens

---

## Componentes

### Sidebar
- Largura: 220px fixo
- Mesmo background do canvas
- Borda direita sutil para separação
- Nav links: `px-3 py-2 rounded-md text-sm font-medium`
- Estado ativo: `bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--accent-foreground))]`
- Estado inativo: `text-[hsl(var(--sidebar-muted))]`
- Ícones: 18x18px
- Logo: ícone 28x28 com bg primary + nome
- Mobile: deslizante com overlay `bg-black/30 backdrop-blur-[2px]`

### Card padrão
```
rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]
```
- Header com `border-b` separando do conteúdo
- Título do header: `text-sm font-semibold`
- Link de ação no header: `text-xs font-medium text-[hsl(var(--primary))]`

### Métricas inline
- Ícone em container 36x36 com bg accent
- Valor: `text-lg font-semibold`
- Label: `text-xs text-muted-foreground`
- Layout horizontal com `flex items-center gap-3`

### Barras de progresso
- Track: `h-1.5 rounded-full bg-[hsl(var(--muted))]`
- Fill: `h-full rounded-full bg-[hsl(var(--primary))]`
- Percentual ao lado: `text-xs font-medium tabular-nums`

### Competências clínicas (assinatura)
- Lista com divide-y
- Cada item: ícone 32x32 + nome + status + barra de progresso
- Status com cores semânticas: Avançado (success), Intermediário (primary), Em desenvolvimento (warning), Iniciante (muted)

### Botão primary inline
```
inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150
```

---

## Assinatura

Progresso por **competências clínicas** — não barras genéricas de "% concluído". Cada competência representa uma área da prática (Avaliação Respiratória, Ventilação Mecânica, Monitorização Hemodinâmica, Mobilização Precoce). Status reflete o vocabulário clínico, não gamificação.

---

## Anti-padrões

- Branco puro (#fff) como fundo — usar creme quente
- Sombras dramáticas — usar bordas sutis
- Gradientes azul-roxo — teal clínico único
- Ícones decorativos sem função
- Sidebar com fundo diferente do conteúdo
- Barras de progresso genéricas sem contexto clínico
