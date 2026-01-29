# 🚀 Guia de Instalação - Reeduca Platform

Este guia vai te ajudar a rodar o projeto no seu Mac do zero.

## ✅ Pré-requisitos

### 1. Instalar Homebrew (se não tiver)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar Node.js (via NVM - recomendado)

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar o terminal
source ~/.zshrc

# Instalar Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verificar instalação
node -v  # deve mostrar v20.x.x
```

### 3. Instalar pnpm

```bash
npm install -g pnpm

# Verificar instalação
pnpm -v  # deve mostrar 9.x.x
```

## 📥 Setup do Projeto

### 1. Clonar/Copiar o projeto

Você já tem os arquivos que criei. Agora vamos para a instalação:

```bash
# Navegue até a pasta do projeto
cd caminho/para/reeduca-platform

# Instalar todas as dependências
pnpm install
```

⏰ **Tempo estimado**: 2-5 minutos (dependendo da internet)

### 2. Configurar Supabase

#### Opção A: Supabase Cloud (Recomendado para começar)

1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Clique em "New Project"
4. Preencha:
   - **Name**: reeduca-platform
   - **Database Password**: crie uma senha forte
   - **Region**: South America (São Paulo)
5. Aguarde o projeto ser criado (~2min)

6. Copie as credenciais:
   - Vá em **Settings** > **API**
   - Copie:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Opção B: Supabase Local (Avançado)

```bash
# Instalar Supabase CLI
brew install supabase/tap/supabase

# Iniciar Supabase local
cd packages/database
supabase start
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp apps/web/.env.example apps/web/.env.local

# Editar com suas credenciais
nano apps/web/.env.local
# ou
code apps/web/.env.local  # se usar VSCode
```

Cole suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Chave service_role (necessária para o painel /admin — ver .env.example)
SUPABASE_SERVICE_ROLE_KEY=

# Deixe o Asaas vazio por enquanto
ASAAS_API_KEY=
ASAAS_WEBHOOK_SECRET=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar Auth (Supabase)

Para login, cadastro e OAuth funcionarem:

1. No **Supabase Dashboard** do projeto, vá em **Authentication** > **URL Configuration**
2. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://seu-dominio.com/auth/callback` (produção, quando tiver)
3. (Opcional) Em **Authentication** > **Providers** > **Email**: ative **Confirm email** se quiser que o usuário confirme o e-mail antes de entrar.

### 5. Instalar dependências

Na raiz do projeto:

```bash
pnpm install
```

(O pacote `@supabase/ssr` foi adicionado para sessão segura com cookies.)

### 6. Criar tabelas no Supabase

#### Se estiver usando Supabase Cloud:

Execute as migrations **na ordem** (cada uma em uma nova query no SQL Editor):

1. **Schema inicial**  
   Cole e execute: `packages/database/supabase/migrations/20260128000000_initial_schema.sql`

2. **Papel cadastrado e policies**  
   Cole e execute: `packages/database/supabase/migrations/20260129000000_add_cadastrado_role.sql`  
   Depois: `packages/database/supabase/migrations/20260129000000_add_profile_insert_policy.sql`

3. **Storage de avatares** (opcional)  
   Cole e execute: `packages/database/supabase/migrations/20260129000001_setup_avatars_storage.sql`

4. **Quiz / Simulados** (necessário para `/admin/simulados` e `/dashboard/simulados`)  
   Cole e execute: `packages/database/supabase/migrations/20260129100000_quiz_simulados.sql`

✅ Cada execução deve terminar com "Success" (ou "No rows returned").

**Se aparecer** `Could not find the table 'public.quiz_questions'`: a migration do quiz (passo 4) ainda não foi rodada. Execute o conteúdo de `20260129100000_quiz_simulados.sql` no SQL Editor do Supabase.

#### Se estiver usando Supabase Local:

```bash
cd packages/database
supabase db push
```

## 👤 Painel admin (`/admin`)

- Rotas: `/admin` (redireciona para `/admin/pessoas`), `/admin/pessoas` (lista com busca, filtros, paginação), `/admin/pessoas/[id]` (detalhe e edição de role/status).
- Acesso: apenas usuários com `profile.role === 'admin'`; o layout do admin redireciona não-admins para `/dashboard`.
- É obrigatório definir `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` (e na Vercel em produção) — o cliente admin usa essa chave para ler e-mails em `auth.users` e contornar RLS.

## 🔐 Login e vínculo usuário ↔ produtos/serviços

- **Rotas de auth:** `/entrar`, `/cadastro`, `/auth/esqueci-senha`, `/auth/reset-password`, `/auth/callback` (OAuth/magic link).
- **Proteção:** o middleware redireciona quem não está logado de `/dashboard/*` para `/entrar` e atualiza a sessão em toda requisição.
- **Usuário ↔ produtos/serviços:** já modelado no banco:
  - **profiles** — `role` (cadastrado, student, instructor, admin), `subscription_status`. Detalhes em **[docs/PAPEIS_E_JORNADA.md](./docs/PAPEIS_E_JORNADA.md)**.
  - **enrollments** — cursos em que o usuário está matriculado
  - **purchases** — compras (produtos/cursos adquiridos)
- Em Server Components ou Server Actions, use `getCurrentUser()` de `@/lib/auth` para obter `user` + `profile` e então consultar enrollments/purchases com o cliente Supabase do servidor.

## 🎯 Rodar o Projeto

### 1. Iniciar servidor de desenvolvimento

```bash
# Na raiz do projeto
pnpm dev
```

Aguarde a mensagem:
```
✓ Ready on http://localhost:3000
```

### 2. Abrir no navegador

Abra: http://localhost:3000

🎉 **Você deve ver a homepage da Reeduca Fisio!**

## 🔍 Verificar se está tudo funcionando

### Teste 1: Homepage carrega
- ✅ Você vê o header "Reeduca Fisio"
- ✅ Botões "Entrar" e "Começar Agora" aparecem

### Teste 2: Supabase conectado
Abra o console do navegador (F12) e não deve ter erros relacionados ao Supabase.

## 🐛 Problemas Comuns

### Erro: "Cannot find module @reeduca/ui"

```bash
# Reinstalar dependências
pnpm clean
pnpm install
```

### Erro: "Missing Supabase environment variables"

Verifique se o arquivo `.env.local` existe em `apps/web/` e tem as variáveis corretas.

### Porta 3000 já está em uso

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou rodar em outra porta
PORT=3001 pnpm dev
```

### pnpm não encontrado

```bash
npm install -g pnpm
```

## 📝 Próximos Passos

Agora que está rodando:

1. **Explorar a estrutura**:
   - `apps/web/app/page.tsx` - Homepage
   - `packages/ui/components/` - Componentes
   - `packages/database/` - Schema do banco

2. **Criar primeira conta de teste**:
   - Clique em "Cadastro"
   - Use um email de teste

3. **Configurar Asaas (opcional)**:
   - Guia completo: **[docs/ASAAS.md](./docs/ASAAS.md)** (onde pegar API key, webhook, sandbox vs produção).
   - Resumo: criar conta em [sandbox.asaas.com](https://sandbox.asaas.com) → Integrações → API → copiar chave → `ASAAS_API_KEY` no `.env.local`.

## 🆘 Precisa de Ajuda?

Se algo não funcionar:

1. Verifique se Node.js está na versão 20+: `node -v`
2. Verifique se pnpm está instalado: `pnpm -v`
3. Tente `pnpm clean` e `pnpm install` novamente
4. Verifique se o arquivo `.env.local` existe e tem as variáveis corretas

---

**Dica Pro**: Use o VSCode com as extensões:
- Tailwind CSS IntelliSense
- Prettier
- ESLint

```bash
# Instalar VSCode (se não tiver)
brew install --cask visual-studio-code
```

🎉 **Pronto! Agora é desenvolver!**

---

## 🚀 Indo para produção

- **Vercel (recomendado)**: guia completo em **[DEPLOY.md](./DEPLOY.md)** — Root Directory `apps/web`, variáveis de ambiente, Supabase Redirect URLs e painel admin.
- **VPS + domínio**: mesmo **[DEPLOY.md](./DEPLOY.md)**, seção “Deploy em VPS + domínio”.
