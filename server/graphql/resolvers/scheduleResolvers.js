const db = require("../../models");
const emailHandler = require("../../middleware/emailHandler");
const {
  transporterConfig,
} = require("../../config/configProvider")();


module.exports = {
  Query: {
    async getExtraHours(root, args, context) {
console.log(args)
      let monthValue = 7
      let yearValue = 2022
      let allTypesToQuery = `'On Call', 'Hotline'`

      let prepareTables = await db.sequelize.query(`
    DROP TABLE IF EXISTS decalate_unpivoted;
    select final.upi, final.engineer, final.type, SUM(days) days, employeer, final.week
INTO decalate_unpivoted
FROM ( 
select *, ROW_NUMBER () OVER (
	    PARTITION BY upi 
	) rank_number FROM (
select 
employees.upi, lastname || ', '|| firstname AS Engineer,
events.type, events.start, events.end,
DATE_PART('day', events."end" - events.start) + 2  as DAYS, employees.employeer, 
employees.activity, 
EXTRACT(week FROM events.start) +1 as week,  'initial' as "whereFrom"  FROM (
(SELECT events.start, events."end", events.nokiaid, events.title, events."bgColor", events.type, events.status, events.replacement, events."createdBy", events.id
	FROM public.events 
 where 
 events.type in (`+ allTypesToQuery + `) 
 and  
 extract(month from events.start) = `+ monthValue + `
 and
 extract(year from events.start) = `+ yearValue + `
--and not events.id in (select id from public.schfited_schedule_processed )
) as events
LEFT JOIN 
(SELECT employees.firstname, employees.lastname, employees.upi, employees.activity,  employees.employeer, nokiaid from public.employees) as employees
ON events.nokiaid = employees.nokiaid) 
	)  as test ) as final
  where employeer = ` + args.employeer + `
	GROUP BY final.upi, final.engineer, final.type, final.week, final."whereFrom", final.employeer order by upi, type`

      )

      let result = await db.sequelize.query(`select * from crosstab (
      'select upi, engineer, type, employeer,  week, case when 	days >1 then ''x''  else NULL end from decalate_unpivoted where type ='` + args.type + `' group by 2,1,3,4,5,6 order by 1,2',
      'VALUES(''27''), (''28''), (''29''), (''30''), (''31'')'
      )
      as newtable (
      UPI varchar, Engineer varchar, type varchar,employeer varchar, week1 varchar,week2 varchar, week3 varchar, week4 varchar, week5 varchar
      );`

      );
      await console.log(result[0])
      return result[0];
    }
  },
  Mutation: {
    async addExtraHours(root, args, context) {
      try {
        // check if eh exist for that resource on that day and if request is on free day
        let checkEH = await db.sequelize.query(`SELECT SUM(duration) FROM  public.extra_hours where "resource_email" = '${args.userEmail}' AND date = '${args.data[0].date}'`);

        if (checkEH[0][0].sum < 10) {

          var sendToPM = true
          const requestDate = new Date(args.data[0].date)
          const extraHour = db.ExtraHours
          newItem = new extraHour(
            ({
              date,
              start,
              end,
              domain,
              service,
              reason,
              scope,
              wbs,
              recovery_date
            } = args.data[0])
          );

          // check if request date is in weekend (email to PM not to be sent then
          // TODO: check if request date is holliday
          if (requestDate.getDay() == 6 || requestDate.getDay() == 0) {
            sendToPM = false
          }

          // check if request is in weekend or legal day and substract one hour
          newItem.resource_email = args.userEmail
          await newItem.save();

          var toList = ""
          var ccList = `cecilia.crisan@nokia.com, ${args.userEmail}`
          // get to and cc based on wbs
          switch (args.data[0].wbs) {
            case 'FRLI000642-FP-PROD':
              toList = 'jihane.targhali@nokia.com'
              ccList = ccList + ', ' + 'anamaria.popescu.ext@nokia.com'
              break;
            case 'FRLI000642-FP-TAC':
              toList = 'cornelia.coanda@nokia.com'
              ccList = ccList + ', ' + 'ionela.cheroiu@nokia.com'
              break;
            case 'FRLI000642-FP-Fiab-Radio':
              toList = 'cornelia.coanda@nokia.com'
              ccList = ccList + ', ' + 'ramona.sperlea@nokia.com'
              break;
            case 'FRLI000642-FP-AMO':
              toList = 'cornelia.coanda@nokia.com'
              ccList = ccList + ', ' + 'diana.bulzan.ext@nokia.com'
              break;
            case 'FRLI000642-FP-SAO':
              toList = 'cornelia.coanda@nokia.com'
              ccList = ccList + ', ' + 'mariana.spulber@nokia.com'
              break;
            case 'FRLI000642-FP-RADIO':
              toList = 'cornelia.coanda@nokia.com'
              ccList = ccList
              break;
            default:
              toList = ccList
            // code block
          }

          sendToPM === true ? null : toList === ''


          var timeStart = new Date("01/01/2007 " + args.data[0].start).getHours();
          var timeEnd = new Date("01/01/2007 " + args.data[0].end).getHours();

          var hourDiff = timeEnd - timeStart;
          // generate email body

          // configure TO based on selected WBS
          const metadata = {
            transporter: transporterConfig,
            from: "poweremail.ni_gsd_timisoara@nokia.com",
            to: toList,
            // to:'alexandru.bran@nokia.com',
            cc: ccList,
            subj: `[NPT] Extra hours reported by: ` + args.userEmail + ` [NPT]`,
            // text: "Th:",
            html: `<div><b>` + args.userEmail + `</b> has reported EH on the <b>` + args.data[0].date + `</b>: ` +
              `<ul><li>start hour: <b>` + args.data[0].start + '</b></li>' +
              `<li>duration: <b>` + args.data[0].duration + 'hour(s)' + `</b></li>` +
              `<li>domain: <b>` + args.data[0].domain + `</b></li>` +
              `<li>WBS: <b>` + args.data[0].wbs + `</b></li>` +
              `<li>service: <b>` + args.data[0].service + `</b></li>` +
              `<li>scope: <b>` + args.data[0].scope + `</b></li>` +
              `<li>reason: <b>` + args.data[0].reason + `</b></li>` +
              `<li>night task: <b>` + args.data[0].nightTask + `</b></li>` +
              `<li>recovery date: <b>` + args.data[0].recovery_date + `</b></li>` +
              `` +
              `</ul> ` +
              `<b>NOTE: email body styling is under delevopment </b>` +
              `</div>`
          };


          // send notification
          // FIXME: catch error and save it in database if email has not been sent
          process.env.NODE_ENV === `development` ? console.log(metadata.html) : emailHandler(metadata).catch(console.error);


          const response = { message: 'Added', success: true }
          return response

        }

        const response = { message: `Request not added, ${checkEH[0][0].sum} hours already exist on the selected date (${args.data[0].date})`, success: false }
        return response
      }
      catch (error) {
        console.log(error)
        const response = { message: error, success: false }
        return response
      }
    },
  }
}