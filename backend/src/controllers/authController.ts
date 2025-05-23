import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
});

export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  body('password')
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

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password tidak boleh kosong')
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

  const { email, password } = req.body;
    await authService.register(email, password);
    
    res.status(201).json({ 
      message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.' 
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    
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
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Token tidak valid' });
      return;
    }

    await authService.verifyEmail(token);
    res.json({ message: 'Email berhasil diverifikasi' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email diperlukan' });
      return;
    }

    await authService.resetPassword(email);
    res.json({ 
      message: 'Jika email terdaftar, instruksi reset password akan dikirim ke email Anda' 
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  }
};

export const confirmResetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ message: 'Token dan password diperlukan' });
      return;
    }

    await authService.confirmResetPassword(token, password);
    res.json({ message: 'Password berhasil direset' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logout berhasil' });
};
