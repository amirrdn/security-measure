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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
class AuthService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    }
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password.length < 8) {
                throw new Error('Password harus minimal 8 karakter');
            }
            if (!/[A-Z]/.test(password)) {
                throw new Error('Password harus mengandung huruf besar');
            }
            if (!/[a-z]/.test(password)) {
                throw new Error('Password harus mengandung huruf kecil');
            }
            if (!/[0-9]/.test(password)) {
                throw new Error('Password harus mengandung angka');
            }
            if (!/[!@#$%^&*]/.test(password)) {
                throw new Error('Password harus mengandung karakter khusus (!@#$%^&*)');
            }
            const existingUser = yield User_1.userModel.findByEmail(email);
            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }
            const user = yield User_1.userModel.create(email, password);
            yield this.sendVerificationEmail(email, user.verification_token);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findByEmail(email);
            if (!user) {
                throw new Error('Email atau password salah');
            }
            if (!user.is_verified) {
                throw new Error('Email belum diverifikasi. Silakan cek email Anda');
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Email atau password salah');
            }
            const signOptions = {
                expiresIn: (process.env.JWT_EXPIRES_IN || '1h')
            };
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret_key', signOptions);
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return { token, user: userWithoutPassword };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield User_1.userModel.verifyEmail(token);
            if (!success) {
                throw new Error('Token verifikasi tidak valid atau sudah digunakan');
            }
        });
    }
    sendVerificationEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Verifikasi Email Anda',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Verifikasi Email Anda</h2>
          <p>Halo,</p>
          <p>Silakan klik tombol di bawah ini untuk memverifikasi email Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Verifikasi Email
            </a>
          </div>
          <p>Atau copy paste link berikut ke browser Anda:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>Link ini akan kadaluarsa dalam 24 jam.</p>
            <p>Jika Anda tidak merasa mendaftar di layanan kami, abaikan email ini.</p>
          </div>
        </div>
      `
            };
            try {
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error('Error sending verification email:', error);
                throw new Error('Gagal mengirim email verifikasi');
            }
        });
    }
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findByEmail(email);
            if (!user) {
                return;
            }
            const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
            yield User_1.userModel.saveResetToken(user.id, resetToken);
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Reset Password',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Reset Password</h2>
          <p>Halo,</p>
          <p>Silakan klik tombol di bawah ini untuk mereset password Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2196F3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Atau copy paste link berikut ke browser Anda:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>Link ini akan kadaluarsa dalam 1 jam.</p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          </div>
        </div>
      `
            };
            try {
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error('Error sending reset password email:', error);
                throw new Error('Gagal mengirim email reset password');
            }
        });
    }
    confirmResetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length < 8) {
                throw new Error('Password harus minimal 8 karakter');
            }
            if (!/[A-Z]/.test(newPassword)) {
                throw new Error('Password harus mengandung huruf besar');
            }
            if (!/[a-z]/.test(newPassword)) {
                throw new Error('Password harus mengandung huruf kecil');
            }
            if (!/[0-9]/.test(newPassword)) {
                throw new Error('Password harus mengandung angka');
            }
            if (!/[!@#$%^&*]/.test(newPassword)) {
                throw new Error('Password harus mengandung karakter khusus (!@#$%^&*)');
            }
            const user = yield User_1.userModel.findByResetToken(token);
            if (!user) {
                throw new Error('Token reset password tidak valid atau sudah kadaluarsa');
            }
            yield User_1.userModel.updatePassword(user.id, newPassword);
            yield User_1.userModel.clearResetToken(user.id);
        });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map