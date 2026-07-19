const APP_NAME = process.env.APP_NAME || 'Weebster';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SUPPORT_EMAIL = 'support@weebster.com';
const CURRENT_YEAR = new Date().getFullYear();

const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #000000;
      padding: 24px 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
      font-size: 16px;
    }
    .content h2 {
      color: #111111;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content p {
      margin: 0 0 16px;
      color: #555555;
    }
    .btn-container {
      margin: 32px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }
    .footer p {
      margin: 0 0 8px;
      color: #888888;
      font-size: 14px;
    }
    .footer a {
      color: #666666;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px 10px;
        width: auto !important;
      }
      .content {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.</p>
      <p>Need help? <a href="mailto:${SUPPORT_EMAIL}">Contact our support team</a></p>
    </div>
  </div>
</body>
</html>
`;

class EmailTemplates {
  getForgotPasswordTemplate(name, resetUrl) {
    const content = `
      <h2>Reset Your Password</h2>
      <p>Hi ${name || 'there'},</p>
      <p>We received a request to reset your password for your ${APP_NAME} account. If you didn't make this request, you can safely ignore this email.</p>
      <div class="btn-container">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      <p>This link is only valid for 15 minutes.</p>
      <p>If the button doesn't work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #888;">${resetUrl}</p>
    `;
    return baseTemplate('Reset Your Password', content);
  }

  getPasswordChangedTemplate(name) {
    const content = `
      <h2>Password Changed Successfully</h2>
      <p>Hi ${name || 'there'},</p>
      <p>This is a confirmation that the password for your ${APP_NAME} account has been changed successfully.</p>
      <p>If you did not authorize this change, please contact our support team immediately.</p>
      <div class="btn-container">
        <a href="${FRONTEND_URL}/login" class="btn">Go to Login</a>
      </div>
    `;
    return baseTemplate('Password Changed', content);
  }

  getWelcomeTemplate(name) {
    const content = `
      <h2>Welcome to ${APP_NAME}!</h2>
      <p>Hi ${name || 'there'},</p>
      <p>We're thrilled to have you on board. At ${APP_NAME}, we are committed to providing you with the best shopping experience.</p>
      <p>Check out our latest arrivals and get started on your journey.</p>
      <div class="btn-container">
        <a href="${FRONTEND_URL}/shop" class="btn">Start Shopping</a>
      </div>
    `;
    return baseTemplate('Welcome to ' + APP_NAME, content);
  }

  getVerifyEmailTemplate(name, verifyUrl) {
    const content = `
      <h2>Verify Your Email</h2>
      <p>Hi ${name || 'there'},</p>
      <p>Thanks for creating an account with ${APP_NAME}! Please click the button below to verify your email address and activate your account.</p>
      <div class="btn-container">
        <a href="${verifyUrl}" class="btn">Verify Email</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #888;">${verifyUrl}</p>
    `;
    return baseTemplate('Verify Your Email', content);
  }

  getOrderConfirmationTemplate(name, orderId, amount) {
    const content = `
      <h2>Order Confirmed</h2>
      <p>Hi ${name || 'there'},</p>
      <p>Thank you for your order! Your order <strong>#${orderId}</strong> for <strong>$${amount}</strong> has been successfully placed.</p>
      <p>We'll send you another email when your order ships.</p>
      <div class="btn-container">
        <a href="${FRONTEND_URL}/account/orders" class="btn">View Order Details</a>
      </div>
    `;
    return baseTemplate('Order Confirmation', content);
  }

  getOrderStatusTemplate(name, orderId, status) {
    const content = `
      <h2>Order Update</h2>
      <p>Hi ${name || 'there'},</p>
      <p>The status of your order <strong>#${orderId}</strong> has been updated to: <strong>${status}</strong>.</p>
      <div class="btn-container">
        <a href="${FRONTEND_URL}/account/orders" class="btn">Track Order</a>
      </div>
    `;
    return baseTemplate('Order Status Update', content);
  }

  getAdminNotificationTemplate(title, message) {
    const content = `
      <h2>Admin Alert: ${title}</h2>
      <p>${message}</p>
      <div class="btn-container">
        <a href="${FRONTEND_URL}/admin" class="btn">Open Admin Dashboard</a>
      </div>
    `;
    return baseTemplate('Admin Notification', content);
  }
}

module.exports = new EmailTemplates();
