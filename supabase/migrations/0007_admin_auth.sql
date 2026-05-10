-- Standalone admin auth (separate from Supabase auth for customers).
-- Username + bcrypt password, JWT cookie session in the app layer.
-- Includes an access-request workflow so people can ask for accounts.

drop table if exists public.admin_access_requests cascade;
drop table if exists public.admin_users cascade;
drop type if exists public.admin_role cascade;
drop type if exists public.admin_request_status cascade;

create type public.admin_role as enum ('super-admin', 'admin', 'match-day');
create type public.admin_request_status as enum ('pending', 'approved', 'rejected');

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  name text not null,
  role public.admin_role not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create index admin_users_username_idx on public.admin_users(lower(username));

create table public.admin_access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role public.admin_role not null,
  notes text,
  status public.admin_request_status not null default 'pending',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.admin_users(id) on delete set null
);

create index admin_access_requests_status_idx
  on public.admin_access_requests(status, requested_at desc);

-- Seed first super-admin: fahad / Whites2026 (bcrypt cost 12).
insert into public.admin_users (username, password_hash, name, role)
values (
  'fahad',
  '$2b$12$fkn6BCiRABS2I5.DNnlOuusJ6jRGlgIxUauGvIlrjLOYbr4PglNL2',
  'Fahad Alsharqawi',
  'super-admin'
)
on conflict (username) do nothing;
