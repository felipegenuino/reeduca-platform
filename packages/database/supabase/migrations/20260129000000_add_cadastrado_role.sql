-- Papel "cadastrado": usuário com conta mas sem compra (não é aluno ainda).
-- Ver docs/PAPEIS_E_JORNADA.md.

-- 1. Incluir 'cadastrado' no check e mudar default para novos signups
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('cadastrado', 'student', 'instructor', 'admin'));

alter table public.profiles
  alter column role set default 'cadastrado';

-- 2. Trigger handle_new_user: continua inserindo sem role (usa default da coluna = cadastrado)
-- Nenhuma alteração no trigger; o default da coluna já cobre.

-- 3. (Opcional) Migrar usuários existentes: quem é "student" e nunca teve compra paga vira "cadastrado"
update public.profiles
set role = 'cadastrado', updated_at = now()
where role = 'student'
  and not exists (
    select 1 from public.purchases p
    where p.user_id = profiles.user_id and p.status = 'paid'
  );
