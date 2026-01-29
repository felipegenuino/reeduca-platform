-- Migration: Configura bucket e policies de avatares (Storage)
-- Data: 2026-01-29
-- Descrição:
-- - Cria o bucket `avatars` (público) se não existir
-- - Cria policies no `storage.objects` para upload/update/delete por dono
-- - Permite leitura pública de avatares

-- Criar bucket (público) se não existir
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'avatars') then
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true);
  end if;
end $$;

-- Garantir RLS (normalmente já vem habilitado no Supabase)
alter table storage.objects enable row level security;

-- Convenção: nome do arquivo deve começar com "{user_id}-"
-- Ex.: "{auth.uid()}-1706544000000.webp"

-- Política: Usuários podem fazer upload de seus próprios avatares
-- O nome do arquivo deve começar com o user_id (formato: {user_id}-{timestamp}.{ext})
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload own avatar'
  ) then
    create policy "Users can upload own avatar"
      on storage.objects for insert
      with check (
        bucket_id = 'avatars' and
        name ~ ('^' || auth.uid()::text || '-')
      );
  end if;
end $$;

-- Política: Usuários podem atualizar seus próprios avatares
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can update own avatar'
  ) then
    create policy "Users can update own avatar"
      on storage.objects for update
      using (
        bucket_id = 'avatars' and
        name ~ ('^' || auth.uid()::text || '-')
      )
      with check (
        bucket_id = 'avatars' and
        name ~ ('^' || auth.uid()::text || '-')
      );
  end if;
end $$;

-- Política: Usuários podem deletar seus próprios avatares
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete own avatar'
  ) then
    create policy "Users can delete own avatar"
      on storage.objects for delete
      using (
        bucket_id = 'avatars' and
        name ~ ('^' || auth.uid()::text || '-')
      );
  end if;
end $$;

-- Política: Público pode ler avatares (bucket é público)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read avatars'
  ) then
    create policy "Public can read avatars"
      on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
end $$;
