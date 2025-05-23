import { Router, Request, Response, NextFunction } from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  resetPassword,
  confirmResetPassword,
  logout,
  loginLimiter,
  validateRegistration,
  validateLogin
} from '../controllers/authController';
import { authenticate, requireVerified } from '../middleware/auth';
import helmet from 'helmet';
import cors from 'cors';

const router = Router();

router.use(helmet());
router.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

router.post('/register', validateRegistration, (req: Request, res: Response, next: NextFunction) => {
  register(req, res).catch(next);
});

router.post('/login', loginLimiter, validateLogin, (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

router.get('/verify-email', (req: Request, res: Response, next: NextFunction) => {
  verifyEmail(req, res).catch(next);
});

router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => {
  resetPassword(req, res).catch(next);
});

router.post('/reset-password/confirm', (req: Request, res: Response, next: NextFunction) => {
  confirmResetPassword(req, res).catch(next);
});

router.post('/logout', (req: Request, res: Response) => {
  logout(req, res);
});

router.get('/profile', authenticate, requireVerified, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export default router;
