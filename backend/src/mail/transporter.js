const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const { logger } = require('../logs');

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    logger.warn('Email Transporter verification failed:', error);
  } else {
    logger.info('Email Transporter ready to send messages');
  }
});

module.exports = transporter;
