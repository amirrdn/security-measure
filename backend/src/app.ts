import express, { Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import { PrismaClient } from '@prisma/client';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/verify-email', (req: Request, res: Response) => {
  const token = req.query.token;
  if (token) {
    res.redirect(`/api/auth/verify-email?token=${token}`);
  } else {
    res.status(400).json({ message: 'Token verifikasi tidak ditemukan' });
  }
});

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/api/auth', authRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

export default app;
