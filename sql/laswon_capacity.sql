SELECT *, 
CASE 
	WHEN "Diff">0 THEN 'ADD '|| "Diff" ||' TO LAWSON'
	WHEN "Diff"<0 THEN 'CHECK IF LAWSON HAS MORE THAN CAPACITY ('|| -1*"Diff" || ')'
END AS "Correction"
	FROM (
	select 
	"dep",
    "Receive_Date",
	"Engineer",
    "upi",
	"email",
	"WBS_Customer", 
	--"Tasks", 
	"sum_capacity",
	"sum_lawson",
	"sum_capacity"-"sum_lawson" as "Diff"
    from (
	(SELECT sum(CAST(public.npt_capacity."Billable_Hours" AS NUMERIC)) as "sum_capacity", public.npt_capacity."WBS_Customer", public.npt_capacity."Engineer", "Engineer_UPI", public.npt_capacity."Receive_Date"
		FROM public.npt_capacity group by  public.npt_capacity."WBS_Customer",  public.npt_capacity."Engineer", "Engineer_UPI", public.npt_capacity."Receive_Date") as sql1
	LEFT JOIN
	( SELECT replace("Resource Code", ' ', '') as "Resource Code", replace("Work Folder Code", ' ', '') as "Work Folder Code", "Time_Writing_Date", SUM(CAST("Number of Hours" AS numeric)) as "sum_lawson"
	FROM public.npt_lawson group by "Resource Code", "Work Folder Code", "Time_Writing_Date") as sql2
	ON sql1."Engineer_UPI" = sql2."Resource Code" and sql1."WBS_Customer" = sql2."Work Folder Code" and sql1."Receive_Date" = sql2."Time_Writing_Date"
	LEFT JOIN
	(SELECT upi, email, "dep" FROM employees) as sqle
	on sql1."Engineer_UPI" = sqle.upi 
	) as main ) as main24  
	WHERE "Diff" <> 0 OR "Diff" is Null  order by "Correction","Engineer";