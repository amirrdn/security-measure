"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const router = (0, express_1.Router)();
router.use((0, helmet_1.default)());
router.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
router.post('/register', authController_1.validateRegistration, (req, res, next) => {
    (0, authController_1.register)(req, res).catch(next);
});
router.post('/login', authController_1.loginLimiter, authController_1.validateLogin, (req, res, next) => {
    (0, authController_1.login)(req, res).catch(next);
});
router.get('/verify-email', (req, res, next) => {
    (0, authController_1.verifyEmail)(req, res).catch(next);
});
router.post('/reset-password', (req, res, next) => {
    (0, authController_1.resetPassword)(req, res).catch(next);
});
router.post('/reset-password/confirm', (req, res, next) => {
    (0, authController_1.confirmResetPassword)(req, res).catch(next);
});
router.post('/logout', (req, res) => {
    (0, authController_1.logout)(req, res);
});
router.get('/profile', auth_1.authenticate, auth_1.requireVerified, (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;
//# sourceMappingURL=auth.js.map