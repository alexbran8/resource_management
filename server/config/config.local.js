const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");

module.exports = {
  JWT_SECRET: "secretString",
  db: new Sequelize("npt", "postgres", "fJdyP2Dyj@&6v!5hMM#VD", {
    host: "10.129.210.150",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }),
  deltaTelConfig: [
    "robert.istocescu@deltatelgroup.com",
    "virgil.mangra@deltatelgroup.com",
    "alexandra.oprisa@deltatelgroup.com",
  ],
  transporterConfig: nodemailer.createTransport({
    service: "SMTP",
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      //   user: "I_GDC_EUR_TM_IS@internal.nsn.com", // generated ethereal user
      user: "poweremail.ni_gsd_timisoara@nokia.com",
      pass: "WSrd9d79ZL359W", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  }),
};
