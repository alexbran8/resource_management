const e = require("cors");
const nodemailer = require("nodemailer");
const db = require("../../models");
const { uid } = require( 'uid');
const {
  transporterConfig,
} = require("../../config/configProvider")();

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

// export default emailHandler;

module.exports = {
  Query: {
    async commentsCheckQuery(root, args, context) {
      console.log(args)
      let result = await db.sequelize.query(`SELECT * FROM public.get_norms_comments_check('${args.department}')`);
      await console.log(result)
      return result[0];

    },
    async getTasksQuery(root, args, context) {
      console.log(args)
      let result = await db.sequelize.query(`SELECT "Capacity",  "Norm_OK", "Norm_NOK_RA" , "id" FROM  public.npt_norms_capacity where "Department" = ('${args.department}')`);
      await console.log(result)
      return result[0];

    },
    async getDistinctNorms(root, args, context) {
      console.log(args)
      console.log(root)
      console.log(context)
      let result = await db.sequelize.query(`SELECT distinct "Capacity" as "task" FROM  public.npt_norms_capacity where "Department" = ('${args.department}')`);
      await console.log(result)
      return result[0];

    },
    async normCheckQuery(root, args, context) {
      console.log(args)
      let result = await db.sequelize.query(`SELECT * FROM get_norms_check('${args.department}')`);
      return result[0];

    },

    async normCheckQueryNA(root, args, context) {
      let result = await db.sequelize.query(`SELECT * FROM get_norms_na()`);

      return result[0];

    },
    async capacityLawsonQuery(root, args, context) {
      let result = await db.sequelize.query(`SELECT * FROM check_capacity_lawson('${args.department}')`);
      return result[0];
    }
  },
  Mutation: {
    async addTask(root, data, context) {
      try {
        uuid = uid(3)
        newTask = new db.Schedule(
          ({
            comments,
            end, 
            nokiaid, 
            start,
            task_status,
            task,
            norm
          } = data.data[0])
        );
        newTask.status = 'L3';
        newTask.uid = uuid
        newTask.bgColor = '#cc33ff';
        newTask.creationDate = new Date();
        newTask.title = data.data[0].task
        newTask.task_operational = true;
        newTask.task_admin = false;
        newTask.type = 'task';
        newTask.notifications = data.notifications ? true: false;
        await newTask.save();
        data.notifications ? await saveNotifications(data.notifications, uuid): null

        


        const response = { message: 'Added' + comments, success: true }
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
        console.log(data.data3)

        var firstList = data.data.map(x => x.to_email)
        let secondList = data.data2.map(x => x.to_email)
        let third = data.data3.map(x => x.to_email)
        mergedList = [...firstList, ...secondList, ...third]
        const uniqueList = [...new Set(mergedList)];


        var groupedArray1 = groupBy(data.data, 'to_email');
        var groupedArray2 = groupBy(data.data2, 'to_email');
        var groupedArray3 = groupBy(data.data3, 'to_email');


        // Object.keys(groupedPeople).forEach(item => { sendEmail(groupedPeople[item], item, context); console.log(groupedPeople[item]); counter++ })
        uniqueList.forEach(item => { sendEmail(item, groupedArray1, groupedArray2, groupedArray3, context); counter++; })

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

function saveNotifications(data, uuid) {
  console.log(data)
  var notification = []
  for (var i = 0; i < data.length; i++) {
    const row = {
      // status: data[i].task_status,
      creationDate: Date.now(),
      createdBy: data[i].nokiaid,
      value: data[i].value,
      uid: uuid
    }
    notification.push(row)
  }
  
  db.Notifications.bulkCreate(notification)
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

function sendEmail(email, data, data2, data3, context) {
  var content = ''
  var content2 = ''
  var content3 = ''
  var table1 = ''
  var table2 = ''
  var table3 = ''
  var resource = email

  data[email] && data[email].length > 0 ? data[email].reduce(function (a, b) {
    console.log(data[email])
    content = a + '<tr><td>' + b.resource + '</td><td>' + b.date
      + '</td><td>' + b.taskComments + '</td><td>' + b.twc + '</td><td>' + b.bh + '</td><td>' + b.normOK + '</td><td>'
      + b.normNok + '</td><td>' + b.var + '</td><td>' + b.correction + '</td></tr>'
    return content
  }, '') : null

  data2[email] && data2[email].length > 0 ? data2[email].reduce(function (a, b) {
    content2 = a + '<tr><td>' + b.resource + '</td><td>' + b.date
      + '</td><td>' + b.workFolderCode + '</td><td>' + b.wbsCustomer + '</td><td>' + b.wbsCheck + '</td><td>' + b.sumLawson + '</td><td>'
      + b.sumCapacity + '</td><td>' + b.var + '</td><td>' + b.correction + '</td></tr>';
    resource = b.resource
    return content2
  }, '') : null

  data3[email] && data3[email].length > 0 ? data3[email].reduce(function (a, b) {
    content3 = a + '<tr><td>' + b.resource + '</td><td>' + b.date
      + '</td><td>' + b.task + '</td><td>' + b.comments + '</td><td>' + b.twc + '</td><td>'  + b.result + '</td><td>' + b.correction + '</td></tr>';
    resource = b.resource
    return content3
  }, '') : null


  if (content != '') {
    table1 = ' <p> Tasks in capacity tool</p>' +
      '<table border="1" style="border-collapse:collapse;text-align:center;padding-left: 20px;padding-right: 20px;"><thead style="background-color:powderblue;">' +
      '<tr><th>RESOURCE</th><th>DATE</th><th>Comments</th><th>Time Writting Comments</th><th>BILLABLE HOURS</th><th>NORM_OK</th><th>NORM_NOK</th><th>VARIATION</th><th>POSSIBLE CORRECTION</th></tr></thead>' +
      '<tbody></tbody> ' + content + '</tbody></table> '
  }
  if (content2 != '') {
    table2 = '<p>lawson vs capacity check</p>' +
      '<table border="1" style="border-collapse:collapse;text-align:center;padding-left: 20px;padding-right: 20px;"><thead style="background-color:powderblue;">' +
      '<tr><th>RESOURCE</th><th>DATE</th><th>WBS CAPACITY</th><th>WBS LAWSON</th><th>WBS CHECK</th><th>LAWSON</th><th>CAPACITY</th><th>VARIATION</th><th>POSSIBLE CORRECTION</th></tr></thead>' +
      '<tbody></tbody> ' + content2 + '</tbody></table> '
  } else { table2 = '<div></div>' }

  if (content3 != '') {
    table3 = '<p>capacity comments check</p>' +
      '<table border="1" style="border-collapse:collapse;text-align:center;padding-left: 20px;padding-right: 20px;"><thead style="background-color:powderblue;">' +
      '<tr><th>RESOURCE</th><th>DATE</th><th>TASK</th><th>COMMENTS</th><th>TIME WRITTING COMMENTS</th><th>RESULT</th><th>CORRECTION</th></tr></thead>' +
      '<tbody></tbody> ' + content3 + '</tbody></table> '
  } else { table3 = '<div></div>' }

  const metadata = {
    transporter: transporterConfig,
    from: "poweremail.ni_gsd_timisoara@nokia.com",
    to: email,
    // to:'alexandru.bran@nokia.com',
    cc: 'cecilia.crisan@nokia.com',
    subj: `[NPT notification] This email requires your attention! [NPT notification]`,
    text: "Please review the following:",
    html: '<div> Dear ' + resource + ', <p> </p><p>Please review the following:</p> ' +
      table1 + table2 + table3 + 
      '<p> Regards,</p><p>Nokia Planning Tool, on behalf of ' + context.user + '  </p></div>'
  };

  // emailHandler(metadata).catch(console.error)

  
    // Notifications.bulkCreate(notification)
      // .then(data => {
      //   res.status(200).send({
      //     message: "Import successfull!",
      //     imported: project.length,
      //     existing: existingEntries.length
      //   });
      // })
      // .catch(err => {
      //   res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating the Project."
      //   });
      // });
  

  process.env.NODE_ENV === `development` ? console.log(metadata.html) : emailHandler(metadata).catch(console.error);
}