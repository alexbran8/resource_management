SELECT * FROM (
(SELECT start, "end", nokiaid, title, "bgColor", type, status, replacement, "createdBy", id, task_type, task_admin, task_operational, notifications, comments, task_status, "creationDate", norm, uid
	FROM public.events
	where type in ('Vacation')
 	and
 	status = 'L3'
	and
	EXTRACT(YEAR FROM "end") = 2022
 	and
 	(EXTRACT(MONTH FROM "start") >= 7
 	OR
 	EXTRACT(MONTH FROM "end") >= 7)
 	and
  	(EXTRACT(MONTH FROM "start") <= 8
 	OR
 	EXTRACT(MONTH FROM "end") <= 8)
 
	order by "start" asc) as sql1
	
	LEFT JOIN
	(SELECT firstname, lastname, email, nokiaid FROM employees) as sql2
	ON sql1.nokiaid = sql2.nokiaid)