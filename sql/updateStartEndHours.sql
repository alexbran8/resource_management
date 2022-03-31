SELECT start, 
start::timestamp AT time zone INTERVAL '+03:30',
start + interval '1' hours,
start::DATE::TIMESTAMP + interval '0 hours' as "new_start", 
start::timestamp + 
              INTERVAL ' 3 HOUR' as start2,
"end", "end"::DATE::TIMESTAMP + interval '9 hours' as "new_end", nokiaid
	FROM public.events 
	where EXTRACT( year from "start") = 2022 and extract (month from "start") >= 3 and nokiaid = 69194302;
	
	update public.events 
	set start = start::timestamp + INTERVAL '2 HOUR'
	where EXTRACT( year from "start") = 2022 and extract (month from "start") >= 3 and nokiaid = 69107070;
	

update public.events set start = start::timestamp + INTERVAL '2 HOUR' where EXTRACT( year from "start") = 2022 and extract (month from "start") >= 3;
update public.events set "end"= "end" - interval '2 hours' where EXTRACT( year from "start") = 2022 and extract (month from "start") >= 3;
	
