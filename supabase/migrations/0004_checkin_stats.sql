-- WejdenSpire — aggregate recent employee check-ins for the mood-trend live edge.
-- Maps the simple mood/energy/stress check-ins into positive/negative affect proxies.

create or replace function checkin_recent_stats()
returns table (
  count bigint,
  positive_avg numeric,
  negative_avg numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)::bigint as count,
    -- positive affect proxy: mood + energy (both 0–100, higher = more positive)
    round(avg((coalesce(mood, 50) + coalesce(energy, 50)) / 2.0)::numeric, 1) as positive_avg,
    -- negative affect proxy: stress (0–100, higher = more negative)
    round(avg(coalesce(stress, 50))::numeric, 1) as negative_avg
  from employee_checkins
  where kind = 'mood'
    and created_at > now() - interval '7 days';
$$;

grant execute on function checkin_recent_stats() to anon, authenticated;
