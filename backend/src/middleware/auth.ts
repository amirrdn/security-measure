import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/User';

interface JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        created_at: Date;
        is_verified: boolean;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Akses ditolak. Token diperlukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    const user = await userModel.findByEmail(decoded.email);
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
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token sudah kadaluarsa' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const requireVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findByEmail(req.user?.email || '');
    if (!user?.is_verified) {
      return res.status(403).json({ 
        message: 'Email belum diverifikasi. Silakan cek email Anda' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}; 