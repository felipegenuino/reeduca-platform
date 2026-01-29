-- Quiz / Simulados: categorias, perguntas, conjuntos e tentativas

-- quiz_categories
create table public.quiz_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- quiz_questions
create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.quiz_categories(id) on delete restrict not null,
  statement text not null,
  options jsonb not null,
  explanation text not null,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column public.quiz_questions.options is 'Array of { letter: string, text: string, is_correct: boolean }. Exactly one is_correct true.';

-- quiz_sets (conjuntos de desafio / simulados)
create table public.quiz_sets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  status text check (status in ('draft', 'published')) default 'draft',
  time_limit_minutes integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- quiz_set_questions (N:N com ordem)
create table public.quiz_set_questions (
  quiz_set_id uuid references public.quiz_sets(id) on delete cascade not null,
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  position integer not null default 0,
  primary key (quiz_set_id, question_id)
);

-- quiz_attempts (tentativa do usuário)
create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_set_id uuid references public.quiz_sets(id) on delete cascade not null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  score integer default 0,
  total integer not null,
  answers_snapshot jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column public.quiz_attempts.answers_snapshot is 'Array of { question_id: string, chosen_letter: string, correct: boolean } for review.';

-- Indexes
create index quiz_questions_category_id_status_idx on public.quiz_questions(category_id, status);
create index quiz_set_questions_quiz_set_id_idx on public.quiz_set_questions(quiz_set_id);
create index quiz_attempts_user_id_quiz_set_id_idx on public.quiz_attempts(user_id, quiz_set_id);
create index quiz_sets_status_idx on public.quiz_sets(status);
create index quiz_categories_sort_order_idx on public.quiz_categories(sort_order);

-- RLS
alter table public.quiz_categories enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_sets enable row level security;
alter table public.quiz_set_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- quiz_categories: autenticados leem; admin gerencia
create policy "Authenticated can view quiz_categories"
  on public.quiz_categories for select
  to authenticated
  using (true);

create policy "Admins can manage quiz_categories"
  on public.quiz_categories for all
  to authenticated
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- quiz_questions: autenticados leem published; admin gerencia
create policy "Authenticated can view published quiz_questions"
  on public.quiz_questions for select
  to authenticated
  using (status = 'published');

create policy "Admins can view all quiz_questions"
  on public.quiz_questions for select
  to authenticated
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admins can manage quiz_questions"
  on public.quiz_questions for all
  to authenticated
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- quiz_sets: autenticados leem published; admin gerencia
create policy "Authenticated can view published quiz_sets"
  on public.quiz_sets for select
  to authenticated
  using (status = 'published');

create policy "Admins can manage quiz_sets"
  on public.quiz_sets for all
  to authenticated
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- quiz_set_questions: quem pode ver o set pode ver as linhas; admin gerencia
create policy "Authenticated can view quiz_set_questions for published sets"
  on public.quiz_set_questions for select
  to authenticated
  using (
    exists (
      select 1 from public.quiz_sets qs
      where qs.id = quiz_set_questions.quiz_set_id and qs.status = 'published'
    )
  );

create policy "Admins can manage quiz_set_questions"
  on public.quiz_set_questions for all
  to authenticated
  using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- quiz_attempts: usuário vê e insere as próprias
create policy "Users can view own quiz_attempts"
  on public.quiz_attempts for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own quiz_attempts"
  on public.quiz_attempts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own quiz_attempts"
  on public.quiz_attempts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Triggers updated_at
create trigger handle_quiz_categories_updated_at
  before update on public.quiz_categories
  for each row execute function public.handle_updated_at();

create trigger handle_quiz_questions_updated_at
  before update on public.quiz_questions
  for each row execute function public.handle_updated_at();

create trigger handle_quiz_sets_updated_at
  before update on public.quiz_sets
  for each row execute function public.handle_updated_at();

create trigger handle_quiz_attempts_updated_at
  before update on public.quiz_attempts
  for each row execute function public.handle_updated_at();
