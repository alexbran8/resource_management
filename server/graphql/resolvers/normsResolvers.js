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
    async getTasksQuery(root, args, context) {
      console.log(args)
      let result = await db.query(`SELECT "Capacity",  "Norm_OK", "Norm_NOK_RA" , "id" FROM  public.npt_norms_capacity where "Department" = ('${args.department}')`);
      await console.log(result)
      return result[0];

    },
    async normCheckQuery(root, args, context) {
      console.log(args)
      let result = await db.query(`SELECT * FROM get_norms_check('${args.department}')`);
      return result[0];

    },

    async normCheckQueryNA(root, args, context) {
      let result = await db.query(`SELECT * FROM get_norms_na()`);

      return result[0];

    },
    async capacityLawsonQuery(root, args, context) {
      let result = await db.query(`SELECT * FROM check_capacity_lawson('${args.department}')`);
      return result[0];
    }
  },
  Mutation: {
    async addTask(root, data, context) {
      try {
      console.log(data.data[0])
      console.log(data.notifications)
      const response = { message: 'Added', success: true }
      return response
    }
    catch (error) {
      console.log(error)
      const response = { message: error, success: false }
      return response
    }

    },
    async sendNotifications(root, data, context) {
      try {
        var counter = 0;
        let merged = [];

        var firstList = data.data.map(x=>x.to_email)
        let secondList = data.data2.map(x=> x.to_email)
        mergedList =[...firstList, ...secondList]
        const uniqueList = [...new Set(mergedList)];
    

        var groupedArray1 = groupBy(data.data, 'to_email');
        var groupedArray2 = groupBy(data.data2, 'to_email');
        

        // Object.keys(groupedPeople).forEach(item => { sendEmail(groupedPeople[item], item, context); console.log(groupedPeople[item]); counter++ })
        uniqueList.forEach(item => {sendEmail(item, groupedArray1, groupedArray2, context);counter++;})

        const response = { message: `${counter} Notifications have been successfully sent!`, success: true }
        return response
      }

      catch (error) {
        console.log(error)
        const response = { message: error, success: false }
        return response
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

function sendEmail(email, data, data2, context) {
  var content = ''
  var content2 = ''
  var table1=''
  var table2=''
  var resource = email

  data[email]&&data[email].length >0 ? data[email].reduce(function (a, b) {
    console.log(data[email])
        content = a +'<tr><td>' + b.resource + '</td><td>' + b.date
      + '</td><td>' + b.taskComments + '</td><td>' + b.twc + '</td><td>' + b.rh + '</td><td>' + b.normOK + '</td><td>'
      + b.normNok + '</td><td>' + b.var + '</td><td>' + b.correction + '</td></tr>'
    return content
  }, '') : null

 data2[email] && data2[email].length> 0 ? data2[email].reduce(function (a, b) {
    content2 = a + '<tr><td>' + b.resource + '</td><td>' + b.date
      + '</td><td>' + b.workFolderCode + '</td><td>' + b.wbsCustomer + '</td><td>' + b.wbsCheck + '</td><td>' + b.sumLawson + '</td><td>'
      + b.sumCapacity + '</td><td>' + b.var + '</td><td>' + b.correction + '</td></tr>';
      resource = b.resource
return content2
}, '') : null


if (content != '') {
  table1=' <p> Tasks in capacity tool</p>' +
  '<table border="1" style="border-collapse:collapse;text-align:center;padding-left: 20px;padding-right: 20px;"><thead style="background-color:powderblue;">'+
  '<tr><th>RESOURCE</th><th>DATE</th><th>Comments</th><th>Time Writting Comments</th><th>REAL HOURS</th><th>NORM_OK</th><th>NORM_NOK</th><th>VARIATION</th><th>POSSIBLE CORRECTION</th></tr></thead>'+
  '<tbody></tbody> ' + content + '</tbody></table> '
} 
if (content2 != '') {
   table2= '<p>lawson vs capacity check</p>'+
  '<table border="1" style="border-collapse:collapse;text-align:center;padding-left: 20px;padding-right: 20px;"><thead style="background-color:powderblue;">'+
  '<tr><th>RESOURCE</th><th>DATE</th><th>WBS CAPACITY</th><th>WBS LAWSON</th><th>WBS CHECK</th><th>LAWSON</th><th>CAPACITY</th><th>VARIATION</th><th>POSSIBLE CORRECTION</th></tr></thead>'+
  '<tbody></tbody> ' + content2 + '</tbody></table> '
} else { table2= '<div></div>'}

  const metadata = {
    transporter: transporterConfig,
    from: "poweremail.ni_gsd_timisoara@nokia.com",
    to: email,
    cc: 'cecilia.crisan@nokia.com',
    subj: `[NPT notification] This email requires your attention! [NPT notification]`,
    text: "Please review the following:",
    html: '<div> Dear ' + resource + ', <p> </p><p>Please review the following:</p> '+
     table1 + table2 + 
     '<p> Regards,</p><p>Nokia Planning Tool, on behalf of ' + context.user + '  </p></div>'
  };
  
  // emailHandler(metadata).catch(console.error)

  process.env.NODE_ENV === `development` ? console.log(metadata.html) : emailHandler(metadata).catch(console.error);
}