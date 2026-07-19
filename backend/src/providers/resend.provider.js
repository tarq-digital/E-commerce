const { Resend } = require('resend');
const { logger } = require('../logs');

class ResendProvider {
  constructor() {
    this.resend = null;
    this.fromAddress = process.env.EMAIL_FROM || 'Weebster <noreply@weebster.com>';
  }

  init() {
    if (!this.resend) {
      if (!process.env.RESEND_API_KEY) {
        logger.warn("RESEND_API_KEY is missing. Emails will be logged but not sent.");
      } else {
        this.resend = new Resend(process.env.RESEND_API_KEY);
      }
    }
  }

  async sendEmail({ to, subject, html }) {
    this.init();

    if (!this.resend) {
      logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      return { id: 'mock-resend-id' };
    }

    try {
      const data = await this.resend.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html,
      });

      if (data.error) {
        logger.error(`Resend API Error sending to ${to}:`, data.error);
        throw new Error(data.error.message || 'Failed to send email via Resend');
      }

      logger.info(`Email successfully sent to ${to} | Subject: ${subject} | ID: ${data.data?.id}`);
      return data;
    } catch (error) {
      logger.error(`Network or SDK Error sending to ${to}:`, error);
      throw error;
    }
  }
}

module.exports = new ResendProvider();
