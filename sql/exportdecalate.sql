--check for possible entries
select upi, lastname || ', '|| firstname AS Engineer, type, start, DATE_PART('day', "end" - start)  as DAYS, employeer, activity, EXTRACT(week FROM start) as week,  "end"  FROM (
(SELECT start, "end", nokiaid, title, "bgColor", type, status, replacement, "createdBy", id
	FROM public.events 
 where 
 type in ('Hotline', 'On call','Morning Tasks') 
 and 
 extract(month from start) = 4
 and 
 extract(year from start) = 2021
 and not id in (select id from public.schfited_schedule_processed )
) as events
LEFT JOIN 
(SELECT firstname, lastname, upi, activity, employeer, nokiaid from public.employees) as employees
ON events.nokiaid = employees.nokiaid);

--add selected entries to processed entries
insert into  public.schfited_schedule_processed
select id from public.events
	where type in ('Hotline', 'On call','Morning Tasks') and extract(month from start) = 4;
	


