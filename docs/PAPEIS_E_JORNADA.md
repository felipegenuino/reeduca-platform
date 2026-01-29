# Papéis de usuário e jornada

Este documento descreve os papéis (`role`) em `public.profiles` e como a plataforma trata cada estágio da jornada do usuário.

---

## 1. Papéis (roles)

| Valor no banco | Nome na UI   | Descrição |
|----------------|-------------|-----------|
| **cadastrado** | Cadastrado  | Conta criada (login/senha), ainda **não comprou nada**. Acesso a área logada (perfil, configurações) e conteúdo público. Não é “aluno” ainda. |
| **student**    | Aluno       | Tem pelo menos uma compra/matrícula. Acesso a “Meus cursos”, player, progresso e certificados. |
| **instructor** | Instrutor   | Ministra ou cria conteúdo. Acesso às ferramentas de instrutor. |
| **admin**      | Administrador | Gestão da plataforma: painel admin, pessoas, produtos, etc. |

---

## 2. Jornada do usuário

```
Anônimo  →  Cadastrado  →  Aluno  →  (opcional) Instrutor
                ↑              ↑
           (cadastro)    (1ª compra paga)
```

- **Anônimo:** sem conta; vê apenas páginas públicas (home, catálogo, preços).
- **Cadastrado:** fez cadastro (e-mail/senha). Pode acessar dashboard básico (perfil, guia de bolso, etc.) e conteúdo público. Não vê “Meus cursos” com conteúdo pago.
- **Aluno:** primeira compra com status pago (ou matrícula concedida) → `role` atualizado para `student`. Acesso a cursos comprados, player, certificados.
- **Instrutor / Admin:** atribuídos manualmente pelo admin (painel Pessoas).

---

## 3. Regras de negócio

### Cadastro (signup)

- Novo usuário em `auth.users` → trigger `handle_new_user` cria linha em `profiles` com **`role = 'cadastrado'`** (default).
- Nenhuma compra é necessária para ter conta.

### Primeira compra paga

- Quando uma compra do usuário passa a **status pago** (ex.: webhook Asaas ou confirmação manual):
  - Se `profiles.role = 'cadastrado'` → atualizar para **`role = 'student'`**.
  - Se já for `student`, `instructor` ou `admin`, manter.
- **Implementação no código:** no handler do webhook de pagamento, chamar:

  ```ts
  import { promoteUserToStudent } from '@/lib/auth';

  // Após confirmar que a compra está paga e obter o user_id do comprador:
  await promoteUserToStudent(userId);
  ```

  A função usa o cliente admin (service_role) e só atualiza se o role atual for `cadastrado`.

### Conteúdo pago (cursos, e-books)

- **Cadastrado:** não vê “Meus cursos” com aulas/conteúdo pago; pode ver catálogo e CTAs para comprar.
- **Aluno (e acima):** vê “Meus cursos”, player e conteúdo dos produtos comprados (conforme `enrollments` / `purchases`).

### Painel admin

- Apenas **`role = 'admin'`** acessa `/admin/*`. Layout do admin redireciona os demais para `/dashboard`.

---

## 4. Onde isso aparece no código

| Onde | O que fazer |
|------|-------------|
| **Migration** | `profiles.role` com check `('cadastrado', 'student', 'instructor', 'admin')` e default `'cadastrado'`. |
| **Trigger `handle_new_user`** | Perfil criado já usa o default da coluna (`cadastrado`). |
| **Types (Database, Profile)** | Tipo do `role` inclui `'cadastrado'`. |
| **Admin (Pessoas)** | Filtro e formulários (criar/editar) incluem opção “Cadastrado”. |
| **Dashboard** | “Meus cursos” / conteúdo pago: exibir apenas se `role === 'student'` (ou se houver matrículas, conforme regra desejada). |
| **Webhook pagamento** | Chamar `promoteUserToStudent(userId)` de `@/lib/auth` ao confirmar compra paga. |

---

## 5. Migration no banco (uma vez)

Rodar a migration `packages/database/supabase/migrations/20260129000000_add_cadastrado_role.sql` em cada projeto Supabase (dev e prod): via **SQL Editor** (colar e executar) ou `supabase db push`. Ela adiciona o valor `cadastrado` ao check de `role`, define default `'cadastrado'` e opcionalmente migra usuários existentes que nunca compraram para `cadastrado`.

## 6. Migração de dados (uma vez)

Ao introduzir o papel `cadastrado`:

- Novos signups passam a receber `role = 'cadastrado'` (default da coluna).
- Usuários já existentes com `role = 'student'` que **nunca tiveram compra** podem ser ajustados para `cadastrado` (opcional), para manter consistência. Exemplo:

  ```sql
  UPDATE public.profiles
  SET role = 'cadastrado', updated_at = now()
  WHERE role = 'student'
    AND NOT EXISTS (
      SELECT 1 FROM public.purchases p
      WHERE p.user_id = profiles.user_id AND p.status = 'paid'
    );
  ```

- Quem já tem compra paga permanece `student`. (A migration acima já faz esse ajuste.)

---

**Última atualização:** janeiro 2026
