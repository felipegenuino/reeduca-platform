# Configurar API do Asaas

Este guia explica como obter e configurar a API do Asaas para pagamentos (PIX, boleto, cartão, assinaturas) na Reeduca Platform.

---

## 1. Conta no Asaas

- **Sandbox (testes):** [https://sandbox.asaas.com](https://sandbox.asaas.com) — crie uma conta para testar sem cobranças reais.
- **Produção:** [https://www.asaas.com](https://www.asaas.com) — conta real para receber pagamentos.

Use o **sandbox** em desenvolvimento e a **conta produção** quando for cobrar de verdade.

---

## 2. Obter a API Key

1. Faça login no painel (sandbox ou produção).
2. No menu, vá em **Integrações** → **API** (ou **Minha conta** → **API**).
3. Em **Chave de API**, clique em **Gerar nova chave** (ou use a chave existente).
4. **Copie e guarde** a chave — ela aparece só uma vez. Formato típico: começa com `$aact_...`.

**Onde colocar:**

- **Desenvolvimento:** em `apps/web/.env.local`:
  ```env
  ASAAS_API_KEY=sua_chave_aqui
  ```
- **Produção (Vercel):** em **Settings** → **Environment Variables** → adicione `ASAAS_API_KEY` com a chave da **conta produção**.

O código usa **sandbox** quando `NODE_ENV !== 'production'` (local = sandbox; Vercel production = API produção).

---

## 3. Webhook (opcional, para confirmação automática)

O webhook avisa sua aplicação quando um pagamento é confirmado (ex.: PIX pago). Assim você pode atualizar o banco e promover o usuário de “cadastrado” para “aluno”.

### 3.1. URL do webhook na aplicação

A rota já existe em `apps/web/app/api/webhooks/asaas/route.ts`. Use estas URLs:

- **Local:** o Asaas **não acessa localhost**. Para testar localmente, use um túnel (ex.: [ngrok](https://ngrok.com/) ou Cloudflare Tunnel) e configure a URL gerada + `/api/webhooks/asaas`.
- **Produção:** `https://reeduca-platform-web.vercel.app/api/webhooks/asaas`.

### 3.2. Configurar no Asaas (produção)

1. No painel Asaas (produção): **Integrações** → **Webhooks**.
2. Adicione uma **URL de notificação**: `https://reeduca-platform-web.vercel.app/api/webhooks/asaas`.
3. Selecione os eventos: **Pagamento confirmado** (`PAYMENT_CONFIRMED`) e **Pagamento recebido** (`PAYMENT_RECEIVED`).
4. Configure um **authToken** (recomendado): gere um valor forte (ex.: UUID v4) e use o mesmo em `ASAAS_WEBHOOK_SECRET` na Vercel. O Asaas envia esse valor no header `asaas-access-token`; a rota valida e rejeita com 401 se não bater.

**Onde colocar o secret:**

- **Desenvolvimento:** em `apps/web/.env.local`:
  ```env
  ASAAS_WEBHOOK_SECRET=seu_webhook_secret_aqui
  ```
- **Produção (Vercel):** em **Environment Variables** → `ASAAS_WEBHOOK_SECRET`.

A rota do webhook valida o header `asaas-access-token` contra `ASAAS_WEBHOOK_SECRET`; se configurado e diferente, responde 401.

---

## 4. Variáveis usadas no projeto

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `ASAAS_API_KEY` | Sim | Chave de API (sandbox para dev, produção para prod). |
| `ASAAS_WEBHOOK_SECRET` | Não* | Token/secret para validar requisições do webhook. |

\* Necessário se você for validar a assinatura do webhook no backend.

Alternativas aceitas pelo código: `PAYMENT_API_KEY` / `PAYMENT_WEBHOOK_SECRET` (genéricas).

---

## 5. Resumo rápido

1. Criar conta no [sandbox.asaas.com](https://sandbox.asaas.com) (testes) e/ou [asaas.com](https://www.asaas.com) (produção).
2. Em **Integrações** → **API**, gerar/copiar a **Chave de API**.
3. Colocar em `apps/web/.env.local` como `ASAAS_API_KEY=...` (e na Vercel em produção).
4. (Opcional) Em **Webhooks**, configurar a URL da sua rota (ex.: `/api/webhooks/asaas`) e, se houver, o secret em `ASAAS_WEBHOOK_SECRET`.

Depois disso, qualquer código que use `PaymentFactory.getProvider()` ou `paymentProvider` do pacote `@reeduca/pagamentos` usará a API do Asaas com a chave configurada.

---

### Checklist: webhook em produção

- [ ] **Vercel:** variáveis `ASAAS_API_KEY` e `ASAAS_WEBHOOK_SECRET` configuradas (produção).
- [ ] **Asaas (produção):** Webhook com URL `https://reeduca-platform-web.vercel.app/api/webhooks/asaas`, eventos **Pagamento confirmado** e **Pagamento recebido**, e **authToken** igual ao `ASAAS_WEBHOOK_SECRET`.
- [ ] **Fluxo de compra:** ao criar a cobrança no Asaas, gravar em `purchases` com `asaas_payment_id` igual ao `id` retornado pelo Asaas, para o webhook encontrar a compra e atualizar para `paid` e promover o usuário a aluno.

---

**Ver também:** [INSTALL.md](../INSTALL.md) (setup geral) e [DEPLOY.md](../DEPLOY.md) (variáveis em produção).
