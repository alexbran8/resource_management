SELECT * FROM
(select distinct replace("Work Folder Code", ' ', '') as "Work Folder Code" FROM public.npt_lawson) as sql1
FULL JOIN
(select distinct "WBS_Customer" FROM public.npt_capacity) as sql2
ON sql1."Work Folder Code" = sql2."WBS_Customer"