create table if not exists public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled world',
  type text not null default 'manual' check (type in ('manual','auto','crash','exit')),
  world jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saves_user_updated_idx on public.saves(user_id, updated_at desc);

alter table public.saves enable row level security;

drop policy if exists "Users can read their own saves" on public.saves;
create policy "Users can read their own saves" on public.saves
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can create their own saves" on public.saves;
create policy "Users can create their own saves" on public.saves
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own saves" on public.saves;
create policy "Users can update their own saves" on public.saves
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own saves" on public.saves;
create policy "Users can delete their own saves" on public.saves
for delete to authenticated using (auth.uid() = user_id);
