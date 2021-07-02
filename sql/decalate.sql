--get recorded entries
select *, ROW_NUMBER () OVER (
	    PARTITION BY upi 
	) rank_number, EXTRACT(week FROM make_date(2021,6,1)) as min_week, EXTRACT(week FROM make_date(2021,6,1)+ interval '1 month' - interval '1 day') as max_week FROM (
select 
employees.upi, lastname || ', '|| firstname AS Engineer, 
events.type, events.start, events.end,
DATE_PART('day', events."end" - events.start) + 2  as DAYS, employees.employeer, 
employees.activity, 
EXTRACT(week FROM events.start) +1 as week,  'initial' as "whereFrom"  FROM (
(SELECT events.start, events."end", events.nokiaid, events.title, events."bgColor", events.type, events.status, events.replacement, events."createdBy", events.id
	FROM public.events 
 where 
 events.type in ('Hotline', 'On Call','Morning Tasks') 
 and 
 extract(month from events.start) = 6
 and 
 extract(year from events.start) = 2021
--and not events.id in (select id from public.schfited_schedule_processed )
) as events
LEFT JOIN 
(SELECT employees.firstname, employees.lastname, employees.upi, employees.activity,  employees.employeer, nokiaid from public.employees) as employees
ON events.nokiaid = employees.nokiaid)
UNION ALL
-- add records needed to be doubled
select 
employees.upi, lastname || ', '|| firstname AS Engineer, 
events.type, events.start, events.end, 
DATE_PART('day', events."end" - events.start)  as DAYS, employees.employeer, 
employees.activity, 
null as week,  
'doubled' as "whereFrom" FROM (
(SELECT events.start, events."end", events.nokiaid, events.title, events."bgColor", events.type, events.status, events.replacement, events."createdBy", events.id
	FROM public.events 
 where 
 events.type in ('Hotline', 'On Call','Morning Tasks') 
 and 
 extract(month from events.start) = 6
 and 
 extract(year from events.start) = 2021
--and not events.id in (select id from public.schfited_schedule_processed )
) as events
LEFT JOIN 
(SELECT employees.firstname, employees.lastname, employees.upi, employees.activity,  employees.employeer, nokiaid from public.employees) as employees
ON events.nokiaid = employees.nokiaid) where  employees.activity = 'Check KPI/Coupure - Bytel Project' 
	)  as final where upi = 'N69165925'