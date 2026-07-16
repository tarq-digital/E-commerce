const dotenv = require("dotenv");
dotenv.config();

const mailConfig = {
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587", 10),
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
  fromAddress: process.env.MAIL_FROM_ADDRESS || "noreply@weebster.in",
  fromName: process.env.MAIL_FROM_NAME || "Weebster",
};

module.exports = mailConfig;
