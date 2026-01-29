# Deploy em produção

Este guia cobre deploy na **Vercel** (recomendado) e em **VPS + domínio**.

---

## Parte 1 — Deploy na Vercel

### 1. Conectar o repositório

1. Acesse [vercel.com](https://vercel.com) e faça login (GitHub/GitLab/Bitbucket).
2. **Add New** → **Project** e importe o repositório `reeduca-platform`.
3. **Import** (não clique em Deploy ainda).

### 2. Configurar o projeto (monorepo)

Na tela de configuração do projeto:

| Campo | Valor |
|-------|--------|
| **Framework Preset** | Next.js (detectado) |
| **Root Directory** | `apps/web` |
| **Build Command** | `pnpm run build` |
| **Install Command** | `pnpm install` |
| **Output Directory** | *(deixar em branco — Next.js usa `.next`)* |
| **Node.js Version** | `20.x` (em **Settings** → **General** → **Node.js Version**) |

**Por quê `apps/web`?** O app Next.js está em `apps/web`. A Vercel usa esse diretório como raiz; o `pnpm install` rodando ali ainda resolve o workspace (monorepo) e instala os pacotes `@reeduca/*`.

### 3. Variáveis de ambiente

Em **Settings** → **Environment Variables**, adicione (para **Production**, **Preview** e **Development** conforme precisar):

| Nome | Valor | Obrigatório |
|------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase (ex.: `https://xxx.supabase.co`) | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave **anon public** do Supabase | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave **service_role** do Supabase (só servidor; usada em `/admin`) | Sim (para admin) |
| `NEXT_PUBLIC_SITE_URL` | URL do app na Vercel (ex.: `https://seu-projeto.vercel.app`) | Sim |

Opcional (pagamentos):

| Nome | Valor |
|------|--------|
| `ASAAS_API_KEY` | API key Asaas |
| `ASAAS_WEBHOOK_SECRET` | Webhook secret Asaas |

**Onde pegar as chaves Supabase**

- **Settings** → **API**: `Project URL`, `anon public`, `service_role` (nunca exponha `service_role` no front).

### 4. Supabase — URLs para a Vercel

No **Supabase Dashboard** do projeto (produção ou o que a Vercel usar):

1. **Authentication** → **URL Configuration**
2. **Site URL**: coloque a URL do app na Vercel (ex.: `https://seu-projeto.vercel.app`).
3. **Redirect URLs** — adicione:
   - `https://seu-projeto.vercel.app/auth/callback`
   - `https://seu-projeto.vercel.app/**` (opcional; permite outros subpaths)

Se usar domínio próprio depois (ex.: `https://app.reeduca.com`), repita com essa URL e `/auth/callback`.

### 5. Deploy

1. Clique em **Deploy**.
2. Aguarde o build. Se der erro, veja a seção **Problemas comuns na Vercel** abaixo.

### 6. Painel admin (`/admin`)

- O painel usa a chave **service_role** para ler `auth.users` e contornar RLS.
- Garanta que `SUPABASE_SERVICE_ROLE_KEY` está definida nas variáveis de ambiente da Vercel.
- Apenas usuários com `profile.role === 'admin'` acessam `/admin`; os demais são redirecionados para `/dashboard`.

---

### Problemas comuns na Vercel

**Build falha com "Cannot find module '@reeduca/ui'" (ou outro pacote do workspace)**

- Confirme que **Root Directory** está como `apps/web` (e não em branco).
- O **Install Command** deve ser `pnpm install` (o pnpm sobe na raiz do monorepo e instala os workspaces).

**Build falha com "Invalid supabaseUrl" ou variável indefinida**

- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão preenchidas para o ambiente que está sendo buildado (Production/Preview).
- URLs devem começar com `https://` (evite typo como `hhttps`).

**Erro "Missing SUPABASE_SERVICE_ROLE_KEY" em `/admin`**

- Adicione `SUPABASE_SERVICE_ROLE_KEY` nas variáveis de ambiente da Vercel (Settings → Environment Variables). Não é uma variável `NEXT_PUBLIC_*`.

**Redirect após login vai para localhost ou URL errada**

- Ajuste no Supabase **Site URL** e **Redirect URLs** para a URL real do app na Vercel (ou domínio custom).
- Defina `NEXT_PUBLIC_SITE_URL` na Vercel com essa mesma URL.

**Node version**

- Em **Project Settings** → **General** → **Node.js Version**, use **20.x** se o projeto exigir Node 20.

---

## Parte 2 — Deploy em VPS + domínio

Use este checklist quando subir a VPS e tiver o domínio pronto.

### 1. Supabase (projeto PROD)

- **Authentication** → **URL Configuration**
  - **Site URL**: `https://seu-dominio.com`
  - **Redirect URLs** (adicione):
    - `https://seu-dominio.com/auth/callback`
    - `https://seu-dominio.com/auth/reset-password` (opcional)

### 2. Variáveis de ambiente na VPS

Use as credenciais do projeto **PROD** (não as do DEV). Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-prod
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-prod
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

(O restante — Asaas, etc. — conforme você já tem no `.env.prod`.)

### 3. DNS

- Apontar o domínio para o IP da VPS:
  - **Registro A**: `seu-dominio.com` → IP da VPS
  - Ou **CNAME** se usar subdomínio (ex.: `app.seu-dominio.com`)

### 4. Resumo

| Onde | O que fazer |
|------|-------------|
| Supabase PROD | Site URL + Redirect URLs com `https://seu-dominio.com` |
| VPS / app | Env vars do PROD + `NEXT_PUBLIC_SITE_URL` + `SUPABASE_SERVICE_ROLE_KEY` se usar admin |
| DNS | A ou CNAME apontando para a VPS |

Depois disso, login, callback, reset de senha e painel admin devem funcionar em produção.
