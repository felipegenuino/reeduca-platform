-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter default privileges revoke execute on functions from public;

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  avatar_url text,
  role text check (role in ('student', 'instructor', 'admin')) default 'student',
  subscription_status text check (subscription_status in ('active', 'inactive', 'trial')),
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  type text check (type in ('ebook', 'course', 'subscription')) not null,
  title text not null,
  description text,
  price decimal(10, 2) not null,
  featured_image text,
  content_url text,
  status text check (status in ('draft', 'published')) default 'draft',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses table
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  modules jsonb,
  duration integer,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enrollments table
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id)
);

-- Purchases table
create table public.purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  amount decimal(10, 2) not null,
  status text check (status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  payment_method text,
  asaas_payment_id text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  source text,
  tags text[],
  status text check (status in ('new', 'contacted', 'converted', 'lost')) default 'new',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index profiles_user_id_idx on public.profiles(user_id);
create index products_type_idx on public.products(type);
create index products_status_idx on public.products(status);
create index courses_product_id_idx on public.courses(product_id);
create index enrollments_user_id_idx on public.enrollments(user_id);
create index enrollments_course_id_idx on public.enrollments(course_id);
create index purchases_user_id_idx on public.purchases(user_id);
create index purchases_status_idx on public.purchases(status);
create index leads_email_idx on public.leads(email);
create index leads_status_idx on public.leads(status);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.purchases enable row level security;
alter table public.leads enable row level security;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Products: Public can read published products
create policy "Public can view published products"
  on public.products for select
  using (status = 'published');

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Courses: Public can read published courses
create policy "Public can view published courses"
  on public.courses for select
  using (
    exists (
      select 1 from public.products
      where id = courses.product_id and status = 'published'
    )
  );

-- Enrollments: Users can read their own enrollments
create policy "Users can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Users can update own enrollment progress"
  on public.enrollments for update
  using (auth.uid() = user_id);

-- Purchases: Users can read their own purchases
create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Leads: Only admins can manage leads
create policy "Admins can manage leads"
  on public.leads for all
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Functions

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger handle_courses_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();

create trigger handle_enrollments_updated_at
  before update on public.enrollments
  for each row execute function public.handle_updated_at();

create trigger handle_purchases_updated_at
  before update on public.purchases
  for each row execute function public.handle_updated_at();

create trigger handle_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
