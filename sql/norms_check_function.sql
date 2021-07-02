DROP FUNCTION get_norms_check;
create or replace function get_norms_check () 
returns TABLE("Dep"  character varying,  "Date" date, "Resource" character varying, "Reported_by_Nokia_ID" character varying, to_email character varying,  "wbsCustomer" character varying, "Task" character varying, "taskComments" character varying, "timeWrittingComments" character varying, "billableHours" character varying, "realHour" character varying, "normOK" character varying, "normNOK" character varying, status text, variation double precision) 
language plpgsql
as $$
declare 
-- variable declaration
begin
return query 
SELECT * FROM (
	select 
	CAST('dep123' as character varying) as "dep",
    "Receive_Date",
	"Engineer",
	main."Reported_by_Nokia_ID",
	"email",
	"WBS_Customer", 
	"Tasks", 
	"Comments", 
	"Time_Writing_Comments",
	"Billable_Hours", 
	"Real_Hours", 
	"Norm_OK", 
	"Norm_NOK_RA", 
	"Comments_Status",
	case
		when "Comments_Status" = 'NOK' then CAST("Billable_Hours" AS FLOAT) - CAST("Norm_NOK_RA" AS FLOAT) 
		when "Comments_Status" = 'OK' then CAST("Billable_Hours" AS FLOAT) - CAST("Norm_OK" AS FLOAT) 
	end as "Diff"
	
from (
	(SELECT 
	 case 	
		when public.npt_capacity."Comments" LIKE '%NOK%' then 'NOK'
		when public.npt_capacity."Comments" LIKE '%OK%' then 'OK'
		else 'N/A'
		end as "Comments_Status",
	 "ID_Project", id, public.npt_capacity."Reported_by",  public.npt_capacity."Capacity_Project_ID", public.npt_capacity."WBS_Customer", public.npt_capacity."Tasks", public.npt_capacity."Engineer", "Engineer_UPI", public.npt_capacity."Comments", "Rework_Task", "ID_TIMEWRITING", "Approved_By_Name", "Reported_by_UPI", public.npt_capacity."Reported_by_Nokia_ID", public.npt_capacity."Billable_Hours", "Hour_Code", public.npt_capacity."Real_Hours", public.npt_capacity."Time_Writing_Comments", "BQ_TWT", "Cost_Object_TWT", public.npt_capacity."Receive_Date"
		FROM public.npt_capacity where public.npt_capacity."WBS_Customer" IN ('FRLI000642-FP-AMO', 'FRLI000642-FP-PROD')) as sql1
	LEFT JOIN
	(SELECT "N", "ServNo", public.npt_norms_capacity."Capacity", "Service_Radio", public.npt_norms_capacity."Norm_OK", public.npt_norms_capacity."Norm_NOK_RA", "_20190528_Norm_OK", "_20190528_Norm_NOK", "Diff_OK", "Diff_NOK", "Norm_FR", "Dif_FR", "Date_modif", "TaskFamily", "Type", "Sub_Project", "Project", "Comment", "PaidBy", "Department", "WBS", id
	FROM public.npt_norms_capacity) as sql2
	ON sql1."Tasks" = sql2."Capacity"
	LEFT JOIN
	(SELECT nokiaid, email FROM employees) as sqle
	on CAST(sql1."Reported_by_Nokia_ID" as INTEGER) = sqle.nokiaid 
	) as main ) as main24 WHERE "Diff" <> 0;
end; $$ 