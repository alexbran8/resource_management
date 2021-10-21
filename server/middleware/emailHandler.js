const nodemailer = require("nodemailer");
const {
    db,
    deltaTelConfig,
    transporterConfig,
  } = require("../config/configProvider")();

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

module.exports = emailHandler