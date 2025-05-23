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
exports.userModel = exports.UserModel = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
class UserModel {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findUnique({ where: { email } });
        });
    }
    create(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
            return prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    verification_token: verificationToken
                }
            });
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.updateMany({
                where: { verification_token: token },
                data: { is_verified: true, verification_token: null }
            });
            return user.count > 0;
        });
    }
    updatePassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });
        });
    }
    saveResetToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.update({
                where: { id: userId },
                data: { reset_token: token }
            });
        });
    }
    findByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.user.findFirst({
                where: { reset_token: token }
            });
        });
    }
    clearResetToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.update({
                where: { id: userId },
                data: { reset_token: null }
            });
        });
    }
}
exports.UserModel = UserModel;
exports.userModel = new UserModel();
//# sourceMappingURL=User.js.map