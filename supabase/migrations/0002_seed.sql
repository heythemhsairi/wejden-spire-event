-- WejdenSpire — seed industry benchmarks + a default active event session.

insert into industry_benchmarks
  (industry, replacement_factor, presenteeism_rate, turnover_median, sickdays_median, dashboard_baselines)
values
  ('Technology',    1.4, 0.045, 13, 6.5,  '{"burnout":68,"overload":62,"turnover":24,"engagement":42,"productivity":-11,"leadership":55}'),
  ('Healthcare',    1.6, 0.060, 18, 9.2,  '{"burnout":74,"overload":69,"turnover":28,"engagement":48,"productivity":-14,"leadership":61}'),
  ('Manufacturing', 1.3, 0.050, 15, 8.0,  '{"burnout":63,"overload":58,"turnover":21,"engagement":40,"productivity":-10,"leadership":52}'),
  ('Finance',       1.8, 0.040, 12, 5.5,  '{"burnout":66,"overload":64,"turnover":19,"engagement":38,"productivity":-9,"leadership":58}'),
  ('Retail',        0.9, 0.055, 26, 7.2,  '{"burnout":61,"overload":55,"turnover":34,"engagement":44,"productivity":-12,"leadership":49}'),
  ('Energy',        1.5, 0.048, 14, 7.8,  '{"burnout":64,"overload":60,"turnover":17,"engagement":41,"productivity":-10,"leadership":56}'),
  ('Public Sector', 1.2, 0.058, 11, 9.8,  '{"burnout":59,"overload":57,"turnover":13,"engagement":46,"productivity":-13,"leadership":47}'),
  ('Other',         1.3, 0.050, 16, 7.5,  '{"burnout":62,"overload":58,"turnover":20,"engagement":43,"productivity":-11,"leadership":53}')
on conflict (industry) do update set
  replacement_factor = excluded.replacement_factor,
  presenteeism_rate  = excluded.presenteeism_rate,
  turnover_median    = excluded.turnover_median,
  sickdays_median    = excluded.sickdays_median,
  dashboard_baselines = excluded.dashboard_baselines;

-- A default active session for the live wall (created idempotently).
insert into event_sessions (name, is_active)
select 'Default Event Session', true
where not exists (select 1 from event_sessions where is_active = true);
