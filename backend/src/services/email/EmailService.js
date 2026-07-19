const resendProvider = require('../../providers/resend.provider');
const templates = require('./utils/EmailTemplates');

class EmailService {
  
  /**
   * Send a welcome email when a user registers.
   */
  async sendWelcome(user) {
    const html = templates.getWelcomeTemplate(user.first_name);
    return resendProvider.sendEmail({
      to: user.email,
      subject: "Welcome to Weebster! 🎉",
      html
    });
  }

  /**
   * Send an email verification link.
   */
  async sendVerification(user, tokenUrl) {
    const html = templates.getVerifyEmailTemplate(user.first_name, tokenUrl);
    return resendProvider.sendEmail({
      to: user.email,
      subject: "Verify your Email Address",
      html
    });
  }

  /**
   * Send a secure password reset link (15 min expiry).
   */
  async sendForgotPassword(user, tokenUrl) {
    const html = templates.getForgotPasswordTemplate(user.first_name, tokenUrl);
    return resendProvider.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html
    });
  }

  /**
   * Send a security alert when password is changed.
   */
  async sendPasswordChangedAlert(user) {
    const html = templates.getPasswordChangedTemplate(user.first_name);
    return resendProvider.sendEmail({
      to: user.email,
      subject: "Security Alert: Password Changed",
      html
    });
  }

  /**
   * Send order confirmation email.
   */
  async sendOrderConfirmation(user, order) {
    const html = templates.getOrderConfirmationTemplate(user.first_name, order.id, order.grand_total);
    return resendProvider.sendEmail({
      to: user.email,
      subject: `Order Confirmed: #${order.id}`,
      html
    });
  }

  /**
   * Send order status update email.
   */
  async sendOrderStatus(user, order) {
    const html = templates.getOrderStatusTemplate(user.first_name, order.id, order.status);
    return resendProvider.sendEmail({
      to: user.email,
      subject: `Order Update: #${order.id} is now ${order.status}`,
      html
    });
  }

  /**
   * Send critical alerts to admin.
   */
  async sendAdminNotification(title, message) {
    // Fallback to EMAIL_FROM if ADMIN_EMAIL is not set
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    const html = templates.getAdminNotificationTemplate(title, message);
    return resendProvider.sendEmail({
      to: adminEmail,
      subject: `Admin Alert: ${title}`,
      html
    });
  }
}

module.exports = new EmailService();
