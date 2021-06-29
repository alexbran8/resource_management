const nodemailer = require("nodemailer");
const {
  db,
  deltaTelConfig,
  transporterConfig,
} = require("../config/configProvider")();

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
  });
};

const emailFormater = async (
  nokiaid,
  status,
  replacement,
  type,
  createdBy,
  start,
  end,
  operation
) => {
  //check to see employeer tpm and manager of the person who initiated the function
  const [ check] = await db.query(
    `SELECT employeer,TPM_FIRSTNAME,TPM_LASTNAME,LINE_MANAGER_FIRSTNAME, LINE_MANAGER_LASTNAME FROM employees WHERE nokiaid=${nokiaid}`
  );

  let TPMemail = await db.query(`SELECT email FROM employees WHERE  lastname || ', ' || firstname =
      '${check[0].tpm_lastname + ", " + check[0].tpm_firstname}'`);

      console.log(check[0])

  let LMemail = await db.query(`SELECT email FROM employees WHERE (lastname || ', ' ||  firstname) =
      '${
        check[0].line_manager_lastname + ", " + check[0].line_manager_firstname
      }'`);

  let sendEmail = await db.query(
    `SELECT "sendEmail" FROM types WHERE type ='${type}'`
  );

  const [findFullName] = await db.query(
    `SELECT concat(lastname, ', ', firstname) as FULLNAME FROM employees WHERE nokiaid=${nokiaid}`
  );
  let newCreatedBy = findFullName[0].FULLNAME;

  let OwnerEmail = await db.query(
    `SELECT email FROM employees WHERE nokiaid ='${nokiaid}'`
  );

  let sendCC = "";
  // check if external
  if (
    check[0].employeer === "Deltatel" &&
    sendEmail[0][0].sendEmail === "YES" &&
    status === "L3"
  ) {
    sendCC = sendCC + deltaTelConfig;
  }
  // check if LM
  console.log(TPMemail)

  if (sendEmail[0][0].sendEmail === "YES") {
    sendCC = sendCC + "," + TPMemail[0][0].email + "," + LMemail[0][0].email;
  }

  //check for replacement
  if (replacement !== "") {
    let replacementEmail;
    replacementEmail = await db.query(
      `SELECT email FROM employees WHERE concat(lastname, ', ', firstname) ='${replacement}'`
    );
    sendCC = sendCC + "," + replacementEmail[0][0].email;
  }

  if (status === "L3") {
    revStatus = "APPROVED:";
  } else if (status === "L2") {
    revStatus = "NEED LM APPROVAL:";
  } else if (status === "L1") {
    revStatus = "NEED TPM/LM APPROVAL:";
  } else {
    revStatus = "";
  }

  const sendTO = OwnerEmail[0][0].email;

  const metadata = {
    transporter: transporterConfig,
    from: "poweremail.ni_gsd_timisoara@nokia.com",
    to: sendTO,
    cc: sendCC,
    subj: `[nptbeta] ${operation}: ${revStatus} - ${type} - ${newCreatedBy} [nptbeta]`,
    text: `${operation}: ${revStatus} ${newCreatedBy} ${type} from ${start} to ${end}.${
      replacement !== "" ? ` ${replacement} as replacement.` : ""
    }`,
    html: "<div> HTML </div>",
  };

  //UNCOMMENT THIS IF YOU WANT TO SEND THE EMAILS!
emailHandler(metadata).catch(console.error);
};

module.exports = {
  errorHandler,
  emailHandler,
  emailFormater,
};
