const getWelcomeTemplate = (name) => `
  <h1>Welcome to Weebster, ${name}!</h1>
  <p>We are thrilled to have you here. Check out our latest products.</p>
`;

const getVerifyEmailTemplate = (name, tokenUrl) => `
  <h1>Verify Your Email, ${name}</h1>
  <p>Please click the link below to verify your email address:</p>
  <a href="${tokenUrl}" style="padding:10px; background:#000; color:#fff; text-decoration:none;">Verify Email</a>
  <p>This link expires in 24 hours.</p>
`;

const getForgotPasswordTemplate = (name, tokenUrl) => `
  <h1>Password Reset Request</h1>
  <p>Hi ${name}, you requested a password reset.</p>
  <p>Click the link below to reset it:</p>
  <a href="${tokenUrl}" style="padding:10px; background:#000; color:#fff; text-decoration:none;">Reset Password</a>
  <p>If you didn't request this, you can safely ignore this email.</p>
  <p>This link expires in 15 minutes.</p>
`;

const getPasswordChangedTemplate = (name) => `
  <h1>Password Changed Successfully</h1>
  <p>Hi ${name}, your password was recently changed.</p>
  <p>If this was you, no further action is needed.</p>
  <p>If you did not perform this action, please contact support immediately.</p>
`;

module.exports = {
  getWelcomeTemplate,
  getVerifyEmailTemplate,
  getForgotPasswordTemplate,
  getPasswordChangedTemplate,
};
