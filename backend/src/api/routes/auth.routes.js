const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { authLimiter } = require('../../middlewares/rate-limiter.middleware');

const registerSchema = require('../../validators/auth/register.schema');
const loginSchema = require('../../validators/auth/login.schema');
const updateProfileSchema = require('../../validators/auth/profile.schema');
const { 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  changePasswordSchema 
} = require('../../validators/auth/password.schema');

const router = express.Router();

// Public Routes (Rate Limited)
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);

// Protected Routes
router.use(requireAuth);

router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);
router.patch('/profile', validate(updateProfileSchema), authController.updateProfile);
router.patch('/change-password', validate(changePasswordSchema), authController.changePassword);

module.exports = router;
