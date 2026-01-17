-- Create a function to calculate bill statistics for a given date range
create or replace function get_bill_stats(start_date date, end_date date)
returns table (
  total_price numeric,
  total_paid numeric,
  total_debt numeric,
  bill_count bigint
)
language plpgsql
as $$
begin
  return query
  select
    coalesce(sum(price), 0) as total_price,
    coalesce(sum(paid), 0) as total_paid,
    coalesce(sum(price - paid), 0) as total_debt,
    count(*) as bill_count
  from bills
  where selected_date >= start_date and selected_date <= end_date;
end;
$$;
