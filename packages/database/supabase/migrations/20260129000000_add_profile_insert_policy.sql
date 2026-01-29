-- Migration: Adiciona policy para usuários criarem seu próprio perfil
-- Data: 2026-01-29
-- Descrição: Permite que usuários criem seu próprio perfil via INSERT (fallback se o trigger falhar)

-- Verifica se a policy já existe antes de criar
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'profiles' 
    and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile"
      on public.profiles for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
