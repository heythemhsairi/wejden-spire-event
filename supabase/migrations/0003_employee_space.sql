-- WejdenSpire — Employee Space: access codes + personal check-ins.

-- Access codes the admin generates and hands to employees.
create table if not exists access_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text,                       -- e.g. company / cohort name
  session_id uuid references event_sessions(id) on delete set null,
  is_active boolean not null default true,
  uses int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists access_codes_code_idx on access_codes(code);

-- Personal employee check-ins (mood + optional wellbeing score).
-- Tied to a code, but NOT personally identifying.
create table if not exists employee_checkins (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references access_codes(id) on delete set null,
  kind text not null default 'mood',   -- 'mood' | 'assessment'
  mood int check (mood between 0 and 100),
  energy int check (energy between 0 and 100),
  stress int check (stress between 0 and 100),
  wellbeing_score int check (wellbeing_score between 0 and 100),
  note text,
  device_hash text,
  created_at timestamptz not null default now()
);
create index if not exists employee_checkins_code_idx on employee_checkins(code_id, created_at);

-- Validate a code (security definer: anon can check without reading the table).
create or replace function validate_access_code(p_code text)
returns table (id uuid, label text, is_active boolean)
language sql
security definer
set search_path = public
as $$
  select id, label, is_active from access_codes where code = p_code limit 1;
$$;

-- RLS
alter table access_codes enable row level security;
alter table employee_checkins enable row level security;

-- No anon table-wide reads. Validation goes through the RPC.
-- Anon may insert their own check-in.
drop policy if exists checkins_insert on employee_checkins;
create policy checkins_insert on employee_checkins for insert to anon, authenticated with check (true);

grant execute on function validate_access_code(text) to anon, authenticated;
