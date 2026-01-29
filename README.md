# 🎓 Reeduca Platform

Plataforma SaaS para educação em Fisioterapia - Sistema completo de cursos, e-books e gestão de conteúdo.

## 🏗️ Arquitetura do Monorepo

```
reeduca-platform/
├── apps/
│   ├── web/              # Landing pages públicas (Next.js)
│   ├── plataforma/       # Área do aluno logado (Next.js)
│   └── admin/            # Painel administrativo (Next.js)
├── packages/
│   ├── ui/               # Design System (Shadcn/ui)
│   ├── database/         # Supabase client + types
│   ├── auth/             # Autenticação
│   ├── pagamentos/       # Integração Asaas
│   └── config/           # Configs compartilhadas
```

## 🚀 Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **UI**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **Pagamentos**: Asaas
- **Monorepo**: Turborepo
- **Package Manager**: pnpm

## 📋 Pré-requisitos

- Node.js 20+
- pnpm 9+
- Conta Supabase
- Conta Asaas (sandbox para testes)

## 🛠️ Setup Inicial

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie os arquivos `.env.example` em cada app e preencha:

```bash
# apps/web/.env.local
cp apps/web/.env.example apps/web/.env.local

# apps/plataforma/.env.local
cp apps/plataforma/.env.example apps/plataforma/.env.local

# apps/admin/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

### 3. Rodar o projeto

```bash
# Desenvolvimento (todos os apps)
pnpm dev

# App específico
pnpm dev --filter=web
pnpm dev --filter=plataforma
pnpm dev --filter=admin
```

## 🗄️ Banco de Dados (Supabase)

### Setup do Supabase

1. Criar projeto em [supabase.com](https://supabase.com)
2. Copiar as credenciais para `.env.local`
3. Rodar migrations:

```bash
# Instalar Supabase CLI
npm i -g supabase

# Login
supabase login

# Link com projeto
supabase link --project-ref SEU_PROJECT_REF

# Rodar migrations
supabase db push
```

### Estrutura do banco

Ver arquivo `packages/database/supabase/migrations/` para schema completo.

## 💳 Pagamentos (Asaas)

Configurar credenciais Asaas em `.env.local`:

```env
ASAAS_API_KEY=seu_api_key
ASAAS_WEBHOOK_SECRET=seu_webhook_secret
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build produção
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Typecheck
pnpm typecheck

# Limpar cache
pnpm clean
```

## 🎨 Design System

O design system está em `packages/ui` usando Shadcn/ui.

Para adicionar componentes:

```bash
cd packages/ui
npx shadcn-ui@latest add button
```

## 📚 Estrutura de Features

### Landing Pages (apps/web)
- Homepage
- Página de cursos
- Blog
- Sobre

### Plataforma do Aluno (apps/plataforma)
- Dashboard
- Meus cursos
- Progresso
- Certificados

### Admin (apps/admin)
- Gestão de cursos
- Gestão de alunos
- Relatórios
- Configurações

## 🔐 Autenticação

Sistema de auth com Supabase:
- Login social (Google, Facebook, Apple)
- Email/senha
- Magic links
- RBAC (Role-Based Access Control)

## 🚢 Deploy

### Vercel (Recomendado para apps Next.js)

```bash
# Deploy automático via GitHub
# Conectar repo ao Vercel
```

### VPS (Produção futura)

```bash
# Docker Compose
docker-compose up -d
```

## 📖 Documentação Adicional

- [Arquitetura](./docs/ARCHITECTURE.md) - Detalhes da arquitetura
- [Contribuindo](./docs/CONTRIBUTING.md) - Guia de contribuição
- [API](./docs/API.md) - Documentação da API

## 👥 Time

- **Kelly Cattelan Bonorino** - Dra. Fisioterapeuta
- **Katerine Cristhine Cani** - Dra. Fisioterapeuta
- **Developer** - Fullstack & Design

## 📄 Licença

Proprietário - Reeduca Fisio © 2026

---

**Status**: 🚧 Em desenvolvimento ativo - MVP
