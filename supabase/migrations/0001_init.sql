-- WejdenSpire Event Platform — initial schema + RLS.
-- Run against the "wejdenspire event" Supabase project.

-- ───────────────────────── Extensions ─────────────────────────
create extension if not exists pgcrypto;

-- ───────────────────────── Tables ─────────────────────────

-- Event sessions: one per event/day. Isolates & resets the live wall.
create table if not exists event_sessions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  is_frozen boolean not null default false,
  created_at timestamptz not null default now()
);

-- EXP 5: anonymous live human signals.
create table if not exists pulse_signals (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references event_sessions(id) on delete cascade,
  energy int not null check (energy between 0 and 100),
  workload int not null check (workload between 0 and 100),
  psych_safety int not null check (psych_safety between 0 and 100),
  support int not null check (support between 0 and 100),
  stress int not null check (stress between 0 and 100),
  device_hash text,
  created_at timestamptz not null default now()
);
create index if not exists pulse_signals_session_idx on pulse_signals(session_id, created_at);

-- Leads (PII — consent required).
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text not null,
  company text,
  role text,
  source_experience text,
  lead_score int not null default 0,
  temperature text not null default 'cold',
  consent boolean not null default false,
  consent_at timestamptz,
  session_id uuid references event_sessions(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_created_idx on leads(created_at desc);

-- Saved experience results (for shareable/emailed reports).
create table if not exists experience_results (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  lead_id uuid references leads(id) on delete set null,
  experience text not null,
  inputs jsonb not null default '{}'::jsonb,
  outputs jsonb not null default '{}'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);
create index if not exists experience_results_token_idx on experience_results(token);

-- Advisor conversations (analytics + abuse review).
create table if not exists advisor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Industry benchmark config (tunable without redeploy).
create table if not exists industry_benchmarks (
  industry text primary key,
  replacement_factor numeric not null,
  presenteeism_rate numeric not null,
  turnover_median numeric not null,
  sickdays_median numeric not null,
  dashboard_baselines jsonb not null default '{}'::jsonb
);

-- ───────────────────────── Aggregate RPC (live wall) ─────────────────────────
-- Security-definer so the anon wall can read aggregates without row-level read access.
create or replace function pulse_session_stats(p_session uuid)
returns table (
  participant_count bigint,
  stress_avg numeric,
  energy_avg numeric,
  workload_avg numeric,
  support_avg numeric,
  psych_safety_avg numeric,
  burnout_exposure numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)::bigint as participant_count,
    round(avg(stress)::numeric, 1) as stress_avg,
    round(avg(energy)::numeric, 1) as energy_avg,
    round(avg(workload)::numeric, 1) as workload_avg,
    round(avg(support)::numeric, 1) as support_avg,
    round(avg(psych_safety)::numeric, 1) as psych_safety_avg,
    -- composite: high stress + high workload + low energy + low support
    round(greatest(0, least(100,
      avg(stress) * 0.35 + avg(workload) * 0.25
      + (100 - avg(energy)) * 0.20 + (100 - avg(support)) * 0.20
    ))::numeric, 1) as burnout_exposure
  from pulse_signals
  where session_id = p_session;
$$;

-- Read a report by exact token (security definer; no table-wide read for anon).
create or replace function get_report(p_token text)
returns setof experience_results
language sql
security definer
set search_path = public
as $$
  select * from experience_results where token = p_token limit 1;
$$;

-- ───────────────────────── RLS ─────────────────────────
alter table event_sessions enable row level security;
alter table pulse_signals enable row level security;
alter table leads enable row level security;
alter table experience_results enable row level security;
alter table advisor_messages enable row level security;
alter table industry_benchmarks enable row level security;

-- Anon may read the active session (to attach pulses to it).
drop policy if exists sessions_read on event_sessions;
create policy sessions_read on event_sessions for select to anon, authenticated using (true);

-- Anon may insert a pulse, but never read raw rows (aggregate via RPC only).
drop policy if exists pulse_insert on pulse_signals;
create policy pulse_insert on pulse_signals for insert to anon, authenticated with check (true);

-- Anon may read benchmarks (used by client-side calculators).
drop policy if exists benchmarks_read on industry_benchmarks;
create policy benchmarks_read on industry_benchmarks for select to anon, authenticated using (true);

-- Leads, results, advisor messages: writes happen via service-role server actions,
-- which bypass RLS. No anon policies = anon cannot read/write directly. Good.

grant execute on function pulse_session_stats(uuid) to anon, authenticated;
grant execute on function get_report(text) to anon, authenticated;

-- ───────────────────────── Realtime ─────────────────────────
-- Add pulse_signals to the realtime publication so the wall gets live inserts.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'pulse_signals'
  ) then
    alter publication supabase_realtime add table pulse_signals;
  end if;
end $$;
