const transporter = require("../mail/transporter");
const mailConfig = require("../config/mail");
const { logger } = require("../logs");
const templates = require("../mail/templates");

class EmailService {
  async sendEmail(to, subject, html) {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[DEV MODE] Email to ${to} | Subject: ${subject}`);
        // We simulate success in dev to avoid SMTP crash if credentials are not set
        return { messageId: 'dev-mode-mock-id' };
      }

      const info = await transporter.sendMail({
        from: `"${mailConfig.fromName}" <${mailConfig.fromAddress}>`,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to} | Subject: ${subject}`);
      return info;
    } catch (error) {
      logger.error(`Failed to send email to ${to}`, error);
      throw error;
    }
  }

  async sendWelcome(user) {
    const html = templates.getWelcomeTemplate(user.first_name);
    return this.sendEmail(user.email, "Welcome to Weebster! 🎉", html);
  }

  async sendVerification(user, tokenUrl) {
    const html = templates.getVerifyEmailTemplate(user.first_name, tokenUrl);
    return this.sendEmail(user.email, "Verify your Email Address", html);
  }

  async sendPasswordReset(user, tokenUrl) {
    const html = templates.getForgotPasswordTemplate(user.first_name, tokenUrl);
    return this.sendEmail(user.email, "Password Reset Request", html);
  }

  async sendPasswordChangedAlert(user) {
    const html = templates.getPasswordChangedTemplate(user.first_name);
    return this.sendEmail(user.email, "Security Alert: Password Changed", html);
  }
}

module.exports = new EmailService();
