#!/bin/bash

# 🚀 Script de Setup Rápido - Reeduca Platform
# Execute este script no seu Mac para configurar tudo automaticamente

set -e  # Para em caso de erro

echo "🎯 Iniciando setup do Reeduca Platform..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "${RED}❌ Erro: Execute este script na raiz do projeto (onde está o package.json)${NC}"
    exit 1
fi

# 1. Verificar Node.js
echo "${BLUE}📦 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js não encontrado!${NC}"
    echo "Instale via: https://nodejs.org ou use NVM"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "${RED}❌ Node.js versão 20+ necessária (atual: $(node -v))${NC}"
    exit 1
fi

echo "${GREEN}✅ Node.js $(node -v)${NC}"

# 2. Verificar/Instalar pnpm
echo "${BLUE}📦 Verificando pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo "Instalando pnpm..."
    npm install -g pnpm
fi
echo "${GREEN}✅ pnpm $(pnpm -v)${NC}"

# 3. Instalar dependências
echo ""
echo "${BLUE}📥 Instalando dependências...${NC}"
echo "Isso pode levar alguns minutos..."
pnpm install

echo "${GREEN}✅ Dependências instaladas!${NC}"

# 4. Configurar .env.local
echo ""
echo "${BLUE}⚙️  Configurando variáveis de ambiente...${NC}"

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "${GREEN}✅ Arquivo .env.local criado${NC}"
    echo ""
    echo "${RED}⚠️  IMPORTANTE:${NC}"
    echo "Edite o arquivo apps/web/.env.local e adicione suas credenciais do Supabase:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "Obtenha em: https://supabase.com/dashboard/project/SEU_PROJETO/settings/api"
else
    echo "${GREEN}✅ .env.local já existe${NC}"
fi

# 5. Instruções finais
echo ""
echo "${GREEN}🎉 Setup concluído!${NC}"
echo ""
echo "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. Configure o Supabase:"
echo "   ${BLUE}→${NC} Acesse https://supabase.com e crie um projeto"
echo "   ${BLUE}→${NC} Copie as credenciais para apps/web/.env.local"
echo "   ${BLUE}→${NC} Execute a migration SQL no SQL Editor do Supabase"
echo ""
echo "2. Inicie o servidor:"
echo "   ${BLUE}→${NC} pnpm dev"
echo ""
echo "3. Abra no navegador:"
echo "   ${BLUE}→${NC} http://localhost:3000"
echo ""
echo "📖 Leia INSTALL.md para instruções detalhadas"
echo ""
