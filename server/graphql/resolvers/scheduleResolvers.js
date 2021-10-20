const db = require("../../models");
// const emailHandler =  require("./normsResolvers");

const emailHandler = async (metadata) => {
  await metadata.transporter.sendMail({
    from: metadata.from,
    to: metadata.to,
    cc: metadata.cc,
    subject: metadata.subj,
    text: metadata.text,
    html: metadata.html
  });
};

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

        // generate email body
        const metadata = {
          transporter: transporterConfig,
          from: "poweremail.ni_gsd_timisoara@nokia.com",
          to: "alexandru.bran@nokia.com",
          // to:'alexandru.bran@nokia.com',
          cc: 'cecilia.crisan@nokia.com',
          subj: `[NPT] Extra hours reported by: `+ args.userEmail + ` [NPT]`,
          // text: "Th:",
          html: '<div>'+args.userEmail + 'has reported EH on the '+ args.data[0].date + ' ( ' +args.data[0].end-args.data[0].start +'  ): </div>'
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