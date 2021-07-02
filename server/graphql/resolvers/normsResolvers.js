const e = require("cors");
const nodemailer = require("nodemailer");
const { db, transporterConfig } = require("../../config/configProvider")();

const errorHandler = (err, req, res, next) => {
  const { code, desc = err.message } = err;
  res.status(code || 500).json({ data: null, error: desc });
};

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
  Query: {
    async normCheckQuery(root, args, context) {
      let result = await db.query(`SELECT * FROM get_norms_check()`);
      return result[0];

    },

    async normCheckQueryNA(root, args, context) {
      let result = await db.query(`SELECT * FROM get_norms_na()`);
      console.log('y')
      return result[0];

    }
  },
  Mutation: {
    async sendNotifications(root, data, context) {
      try {
  
        var groupedPeople = groupBy(data.data, 'resource');
        
        Object.keys(groupedPeople).forEach(item => sendEmail(groupedPeople[item]))

        function sendEmail(data) {
          data.reduce(function (a, b) {
            content = a + '<tr><td>' +  b.resource + '</td><td>' + b.date 
            +  '</td><td>' +  b.taskComments + '</td><td>' +  b.twc + '</td><td>' +  b.rh + '</td><td>' +  b.normOK + '</td><td>'
             + b.normNok + '</td><td>' + b.var + '</td></tr>';
            return content
          }, '')
          const metadata = {
            transporter: transporterConfig,
            from: "poweremail.ni_gsd_timisoara@nokia.com",
            to: 'alexandru.bran@nokia.com',
            cc: 'alexandru.bran@nokia.com',
            subj: `[capacity notification] Please review the following tasks in capacity [capacity notification]`,
            text: "Please review the following norms in capacity:",
            html: '<div> Please review the following capacity tasks: <table border="1" style="border-collapse:collapse;"><thead style="background-color:powderblue;"><tr><th>RESOURCE</th><th>DATE</th><th>TC</th><th>TWC</th><th>REAL HOURS</th><th>NORM_OK</th><th>NORM_NOK</th><th>VARIATION</th></tr></thead><tbody></tbody> ' + content + '</tbody></table></div>'
          };
          emailHandler(metadata).catch(console.error);
        }
      }

      catch (error) {
        console.log(error)
      }
    }
  }
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}