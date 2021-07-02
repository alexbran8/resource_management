create or replace function exportSS(month int, year int)
   returns table (upi character varying(50), 
				  enginner text, type character varying(50), start timestamp with time zone,days double precision,employeer character varying(50), activity character varying(50), week double precision ,  "end" timestamp with time zone)
   --(upi, Engineer, type, start, end, activity, week ) 
   language plpgsql
  as
$$
declare 
-- variable declaration
begin
return query 
select 
employees.upi, lastname || ', '|| firstname AS Engineer, 
events.type, events.start, 
DATE_PART('day', events."end" - events.start)  as DAYS, employees.employeer, 
employees.activity, 
EXTRACT(week FROM events.start) +1 as week,  
events."end"  FROM (
(SELECT events.start, events."end", events.nokiaid, events.title, events."bgColor", events.type, events.status, events.replacement, events."createdBy", events.id
	FROM public.events 
 where 
 events.type in ('Hotline', 'On call','Morning Tasks') 
 and 
 extract(month from events.start) = month
 and 
 extract(year from events.start) = year
 and not events.id in (select id from public.schfited_schedule_processed )
) as events
LEFT JOIN 
(SELECT employees.firstname, employees.lastname, employees.upi, employees.activity,  employees.employeer, nokiaid from public.employees) as employees
ON events.nokiaid = employees.nokiaid);
end;
$$

