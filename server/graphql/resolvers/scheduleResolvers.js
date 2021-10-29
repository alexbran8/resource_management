const db = require("../../models");
const emailHandler = require("../../middleware/emailHandler");
const {
  transporterConfig,
} = require("../../config/configProvider")();


module.exports = {

  Mutation: {
    async addExtraHours(root, args, context) {
      try {
        console.log(args)
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
            wbs
          } = args.data[0])
        );
        newItem.resource_email = args.userEmail
        await newItem.save();
        
        var timeStart = new Date("01/01/2007 " +  args.data[0].start).getHours();
        var timeEnd = new Date("01/01/2007 " +  args.data[0].end).getHours();
        
        var hourDiff = timeEnd - timeStart;             
        console.log( args.data[0].end, timeStart, timeEnd, hourDiff)
        // generate email body

        // configure TO based on selected WBS

        const metadata = {
          transporter: transporterConfig,
          from: "poweremail.ni_gsd_timisoara@nokia.com",
          to: "alexandru.bran@nokia.com",
          // to:'alexandru.bran@nokia.com',
          cc: 'cecilia.crisan@nokia.com',
          subj: `[NPT] Extra hours reported by: ` + args.userEmail + ` [NPT]`,
          // text: "Th:",
          html: `<div>` + args.userEmail + ` has reported EH on the ` + args.data[0].date + `: `+
            `<ul><li>start hour: ` + args.data[0].start + 
            `<li>duration: ` + args.data[0].duration + `</li>` + 
            `<li>domain: ` + args.data[0].domain + `</li>` + 
            `<li>scope: ` + args.data[0].scope + `</li>` + 
            `<li>reason: ` + args.data[0].reason + `</li>` + 
            `<li>service: ` + args.data[0].service + `</li>` + 
            `</ul> ` +
            `NOTE: email body styling is under delevopment` +
            `</div>`
        };


        // send notification
        process.env.NODE_ENV === `development` ? console.log(metadata.html) : emailHandler(metadata).catch(console.error);
        emailHandler(metadata).catch(console.error)

        const response = { message: 'Added', success: true }
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