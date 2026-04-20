-- ==========================================
-- SETUP DATABASE FINANCE AI
-- Jalankan script ini di SQL Editor Supabase
-- ==========================================

-- 1. Tabel Profiles (Sinkron dengan Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  category text not null,
  description text,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabel AI Summaries (Cache)
create table if not exists public.ai_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null, -- Format: YYYY-MM
  summary text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, month)
);

-- 4. Aktifkan RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.ai_summaries enable row level security;

-- 5. Policies (Hanya user yang punya data yang bisa akses)
create policy "User can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "User can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "User can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "User can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "User can update own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "User can delete own transactions" on public.transactions for delete using (auth.uid() = user_id);

create policy "User can view own ai_summaries" on public.ai_summaries for select using (auth.uid() = user_id);
create policy "User can insert own ai_summaries" on public.ai_summaries for insert with check (auth.uid() = user_id);
create policy "User can update own ai_summaries" on public.ai_summaries for update using (auth.uid() = user_id);

-- 6. Trigger Otomatis Create Profile saat Signup
-- Ini adalah solusi untuk "Database error saving new user"
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Hapus trigger jika sudah ada
drop trigger if exists on_auth_user_created on auth.users;

-- Buat trigger baru
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
