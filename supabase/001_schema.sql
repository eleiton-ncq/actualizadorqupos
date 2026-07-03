create extension if not exists pgcrypto;

create table if not exists public.update_campaigns (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  status text not null default 'active'
    check (status in ('draft', 'active', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.workers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  access_key text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id text primary key default gen_random_uuid()::text,
  campaign_id text not null references public.update_campaigns(id) on delete cascade,
  assigned_worker_id text references public.workers(id) on delete set null,
  client_name text not null,
  identification text not null,
  current_phone text,
  current_phone_2 text,
  current_email text,
  current_address text,
  company_name text,
  cli_code text,
  trade_name text,
  contact_info text,
  fax text,
  support_expires_at date,
  distributor text,
  contract_type text,
  contract_description text,
  licenses_light integer,
  licenses_standard integer,
  licenses_erp integer,
  licenses_routes integer,
  licenses_total integer,
  source_sheet text,
  updated_phone text,
  updated_email text,
  updated_address text,
  updated_contact_name text,
  updated_main_contact_name text,
  updated_main_contact_phone text,
  updated_main_contact_email text,
  updated_billing_contact_name text,
  updated_billing_contact_phone text,
  updated_billing_contact_email text,
  updated_support_contact_name text,
  updated_support_contact_phone text,
  updated_support_contact_email text,
  updated_address_province text,
  updated_address_canton text,
  updated_address_district text,
  updated_address_details text,
  observations text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_campaign_status_idx
  on public.clients (campaign_id, status);

create index if not exists clients_worker_status_idx
  on public.clients (assigned_worker_id, status);

create index if not exists clients_cli_code_idx
  on public.clients (cli_code);

alter table public.clients add column if not exists current_phone_2 text;
alter table public.clients add column if not exists cli_code text;
alter table public.clients add column if not exists trade_name text;
alter table public.clients add column if not exists contact_info text;
alter table public.clients add column if not exists fax text;
alter table public.clients add column if not exists support_expires_at date;
alter table public.clients add column if not exists distributor text;
alter table public.clients add column if not exists contract_type text;
alter table public.clients add column if not exists contract_description text;
alter table public.clients add column if not exists licenses_light integer;
alter table public.clients add column if not exists licenses_standard integer;
alter table public.clients add column if not exists licenses_erp integer;
alter table public.clients add column if not exists licenses_routes integer;
alter table public.clients add column if not exists licenses_total integer;
alter table public.clients add column if not exists source_sheet text;
alter table public.clients add column if not exists updated_main_contact_name text;
alter table public.clients add column if not exists updated_main_contact_phone text;
alter table public.clients add column if not exists updated_main_contact_email text;
alter table public.clients add column if not exists updated_billing_contact_name text;
alter table public.clients add column if not exists updated_billing_contact_phone text;
alter table public.clients add column if not exists updated_billing_contact_email text;
alter table public.clients add column if not exists updated_support_contact_name text;
alter table public.clients add column if not exists updated_support_contact_phone text;
alter table public.clients add column if not exists updated_support_contact_email text;
alter table public.clients add column if not exists updated_address_province text;
alter table public.clients add column if not exists updated_address_canton text;
alter table public.clients add column if not exists updated_address_district text;
alter table public.clients add column if not exists updated_address_details text;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

alter table public.update_campaigns enable row level security;
alter table public.workers enable row level security;
alter table public.clients enable row level security;

drop policy if exists "prototype read campaigns" on public.update_campaigns;
create policy "prototype read campaigns"
on public.update_campaigns for select
to anon
using (true);

drop policy if exists "prototype write campaigns" on public.update_campaigns;
create policy "prototype write campaigns"
on public.update_campaigns for all
to anon
using (true)
with check (true);

drop policy if exists "prototype read workers" on public.workers;
create policy "prototype read workers"
on public.workers for select
to anon
using (true);

drop policy if exists "prototype write workers" on public.workers;
create policy "prototype write workers"
on public.workers for all
to anon
using (true)
with check (true);

drop policy if exists "prototype read clients" on public.clients;
create policy "prototype read clients"
on public.clients for select
to anon
using (true);

drop policy if exists "prototype write clients" on public.clients;
create policy "prototype write clients"
on public.clients for all
to anon
using (true)
with check (true);
