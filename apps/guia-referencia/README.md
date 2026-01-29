# 📋 Guia de Referência Rápida - Reeduca Fisio

Aplicação web interativa do Guia de Avaliação Fisioterapêutica Respiratória e Motora.

## 🎯 Objetivo

Digitalizar o material físico (cards adesivados) usado por Kelly e Katerine na UTI, tornando-o acessível via celular/tablet.

## ✨ Funcionalidades

- ✅ **Cards interativos** - Clique para expandir/recolher
- ✅ **Busca rápida** - Encontre qualquer escala rapidamente
- ✅ **Design responsivo** - Funciona em celular, tablet e desktop
- ✅ **Exportar PDF** - Botão para imprimir/salvar como PDF
- ✅ **Offline-first** - Funciona sem internet (PWA)

## 📊 Escalas Incluídas

### Nível de Consciência
- **Glasgow** - Avaliação do nível de consciência (3-15 pontos)

### Sedação
- **Ramsay** - Níveis de sedação (1-6)
- **RASS** - Richmond Agitation-Sedation Scale (-5 a +4)

### Respiratória
- **Borg** - Avaliação da dispneia (0-10)
- **Gasometria** - Valores normais e distúrbios

### Motora
- **MRC** - Medical Research Council - Força muscular (0-5)

## 🚀 Como rodar

### Desenvolvimento

```bash
# Na raiz do monorepo
pnpm install
pnpm dev

# Ou rodar apenas este app
cd apps/guia-referencia
pnpm dev
```

Acesse: http://localhost:3001

### Build para produção

```bash
pnpm build
```

## 📱 Como usar na UTI

### 1. Celular/Tablet
- Acesse a URL
- Adicione à tela inicial (funciona como app)
- Use offline

### 2. Imprimir cards
- Clique em "Exportar PDF"
- Imprima
- Cole com fita adesiva (como antes)

## 🎨 Design

- **Cores**: Verde hospitalar + azul médico
- **Tipografia**: Clara e legível para leitura rápida
- **Cards**: Estilo material com hover effects
- **Mobile-first**: Otimizado para uso em dispositivos móveis

## 📝 Próximas melhorias

- [ ] PWA completo (funcionar 100% offline)
- [ ] Modo escuro
- [ ] Calculadoras integradas (IMC, doses, etc)
- [ ] Histórico de avaliações
- [ ] Exportar relatório de paciente
- [ ] Adicionar mais escalas (SOFA, APACHE, etc)

## 🔄 Atualizações futuras

Este material será constantemente atualizado conforme:
- Novas escalas forem necessárias
- Feedback das professoras e alunos
- Protocolos hospitalares mudarem

---

**Desenvolvido para:** Kelly Cattelan Bonorino e Katerine Cristhine Cani  
**Baseado em:** Guia de Avaliação Fisioterapêutica Respiratória e Motora (Reabilitar, 2014)
