import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { userModel, User } from '../models/User';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

class AuthService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async register(email: string, password: string): Promise<void> {
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

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const user = await userModel.create(email, password);
    
    await this.sendVerificationEmail(email, user.verification_token!);
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Email belum terdaftar');
    }

    if (!user.is_verified) {
      throw new Error('Email belum diverifikasi. Silakan cek email Anda');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Email atau password salah');
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      signOptions
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return { token, user: userWithoutPassword };
  }

  async verifyEmail(token: string): Promise<void> {
    const success = await userModel.verifyEmail(token);
    if (!success) {
      throw new Error('Token verifikasi tidak valid atau sudah digunakan');
    }
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
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
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Gagal mengirim email verifikasi');
    }
  }

  async resetPassword(email: string): Promise<void> {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Email tidak terdaftar');
    }
    const resetToken = randomBytes(32).toString('hex');
    await userModel.saveResetToken(user.id, resetToken);
    
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
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Gagal mengirim email reset password');
    }
  }

  async confirmResetPassword(token: string, newPassword: string): Promise<void> {
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

    const user = await userModel.findByResetToken(token);
    if (!user) {
      throw new Error('Token reset password tidak valid atau sudah kadaluarsa');
    }

    await userModel.updatePassword(user.id, newPassword);
    await userModel.clearResetToken(user.id);
  }
}

export const authService = new AuthService(); 