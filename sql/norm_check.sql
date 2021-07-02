Select * FROM (
select 
    "Receive_Date",
	"Engineer",
	"WBS_Customer", 
	"Tasks", 
	"Capacity", 
	"Comments", 
	"Time_Writing_Comments"
	"Billable_Hours", 
	"Real_Hours", 
	"Norm_OK", 
	"Norm_NOK_RA", 
	"Comments_Status",
	--count("Comments_Status"),
	case
		when "Comments_Status" = 'NOK' then CAST("Billable_Hours" AS FLOAT) - CAST("Norm_NOK_RA" AS FLOAT) 
		when "Comments_Status" = 'OK' then CAST("Billable_Hours" AS FLOAT) - CAST("Norm_OK" AS FLOAT) 
	end as "Diff"
	
from (
	(SELECT 
	 case 	
		when "Comments" LIKE '%NOK%' then 'NOK'
		when "Comments" LIKE '%OK%' then 'OK'
		else 'N/A'
		end as "Comments_Status",
	 "ID_Project", id, "Capacity_Project_ID", "WBS_Customer", "Tasks", "Engineer", "Engineer_UPI", "Comments", "Rework_Task", "ID_TIMEWRITING", "Reported_by", "Approved_By_Name", "Reported_by_UPI", "Reported_by_Nokia_ID", "Billable_Hours", "Hour_Code", "Real_Hours", "Time_Writing_Comments", "BQ_TWT", "Cost_Object_TWT", "Receive_Date"
		FROM public.npt_capacity where "WBS_Customer" IN ('FRLI000642-FP-AMO', 'FRLI000642-FP-PROD')) as sql1
	LEFT JOIN
	(SELECT "N", "ServNo", "Capacity", "Service_Radio", "Norm_OK", "Norm_NOK_RA", "_20190528_Norm_OK", "_20190528_Norm_NOK", "Diff_OK", "Diff_NOK", "Norm_FR", "Dif_FR", "Date_modif", "TaskFamily", "Type", "Sub_Project", "Project", "Comment", "PaidBy", "Department", "WBS", id
	FROM public.npt_norms_capacity) as sql2
	ON sql1."Tasks" = sql2."Capacity"
	) as main ) as main24 WHERE "Diff" <> 0