"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.confirmResetPassword = exports.resetPassword = exports.verifyEmail = exports.login = exports.register = exports.validateLogin = exports.validateRegistration = exports.loginLimiter = void 0;
const authService_1 = require("../services/authService");
const express_validator_1 = require("express-validator");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
});
exports.validateRegistration = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email tidak valid'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter')
        .matches(/[A-Z]/)
        .withMessage('Password harus mengandung huruf besar')
        .matches(/[a-z]/)
        .withMessage('Password harus mengandung huruf kecil')
        .matches(/[0-9]/)
        .withMessage('Password harus mengandung angka')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password harus mengandung karakter khusus (!@#$%^&*)')
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email tidak valid'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
];
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        yield authService_1.authService.register(email, password);
        res.status(201).json({
            message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.'
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        const { token, user } = yield authService_1.authService.login(email, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });
        res.json({
            message: 'Login berhasil',
            user,
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
});
exports.login = login;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: 'Token tidak valid' });
            return;
        }
        yield authService_1.authService.verifyEmail(token);
        res.json({ message: 'Email berhasil diverifikasi' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
});
exports.verifyEmail = verifyEmail;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email diperlukan' });
            return;
        }
        yield authService_1.authService.resetPassword(email);
        res.json({
            message: 'Jika email terdaftar, instruksi reset password akan dikirim ke email Anda'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});
exports.resetPassword = resetPassword;
const confirmResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            res.status(400).json({ message: 'Token dan password diperlukan' });
            return;
        }
        yield authService_1.authService.confirmResetPassword(token, password);
        res.json({ message: 'Password berhasil direset' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }
    }
});
exports.confirmResetPassword = confirmResetPassword;
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout berhasil' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map