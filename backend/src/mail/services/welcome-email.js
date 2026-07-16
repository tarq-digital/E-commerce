const transporter = require('../transporter');
const mailConfig = require('../../config/mail');
const { logger } = require('../../logs');

const sendWelcomeEmail = async (toEmail, firstName) => {
  const mailOptions = {
    from: `"${mailConfig.fromName}" <${mailConfig.fromAddress}>`,
    to: toEmail,
    subject: 'Welcome to Weebster! 🎉',
    html: `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for joining Weebster. We are excited to have you.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${toEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send welcome email to ${toEmail}`, error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
};
