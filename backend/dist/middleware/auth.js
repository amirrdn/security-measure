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
exports.requireVerified = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        if (!token) {
            return res.status(401).json({ message: 'Akses ditolak. Token diperlukan' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.userModel.findByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ message: 'User tidak ditemukan' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            is_verified: user.is_verified
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token tidak valid' });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Token sudah kadaluarsa' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});
exports.authenticate = authenticate;
const requireVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.userModel.findByEmail(((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || '');
        if (!(user === null || user === void 0 ? void 0 : user.is_verified)) {
            return res.status(403).json({
                message: 'Email belum diverifikasi. Silakan cek email Anda'
            });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});
exports.requireVerified = requireVerified;
//# sourceMappingURL=auth.js.map