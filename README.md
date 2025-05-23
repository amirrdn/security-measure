# Sistem Autentikasi

Sistem autentikasi fullstack yang aman dan modern dengan fitur lengkap untuk manajemen user, verifikasi email, dan keamanan tingkat tinggi.

## 🌐 Demo

Demo aplikasi dapat diakses di: [https://security-measure.vercel.app/](https://security-measure.vercel.app/)

## 🚀 Fitur Utama

### Backend
- 🔐 Autentikasi JWT dengan refresh token
- ✉️ Verifikasi email
- 🔒 Password hashing dengan bcrypt
- 🛡️ Rate limiting untuk mencegah brute force
- 📧 Notifikasi email untuk verifikasi dan reset password
- 🧪 Test coverage yang komprehensif
- 🔍 Validasi input yang ketat
- 🛡️ Keamanan multi-layer

### Frontend
- 🎨 Modern UI dengan Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time form validation
- 🚀 Next.js 14 dengan App Router
- 🎯 TypeScript untuk type safety
- 🔒 Protected routes
- 📝 Form handling dengan validasi
- 🎭 Dark/Light mode support

## 📋 Prasyarat

- Node.js (v14 atau lebih tinggi)
- PostgreSQL
- NPM atau Yarn
- Gmail account (untuk pengiriman email)

## 🛠️ Instalasi

### Backend Setup

1. Masuk ke direktori backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```
Edit file `.env` dengan konfigurasi yang sesuai:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"

# Email
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Security
SESSION_SECRET="your-session-secret"
CORS_ORIGIN="http://localhost:3000"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

4. Setup database:
```bash
npx prisma migrate dev
```

5. Jalankan server development:
```bash
npm run dev
```

### Frontend Setup

1. Masuk ke direktori frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

## 🏗️ Struktur Proyek

### Backend
```
backend/
├── src/
│   ├── controllers/    # Logic handler
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── app.ts          # Express app setup
├── tests/              # Test files
├── prisma/             # Database schema & migrations
└── docs/              # Dokumentasi
```

### Frontend
```
frontend/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript types
├── public/            # Static assets
└── styles/           # Global styles
```

## 🔌 API Endpoints

### Autentikasi
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify-email` - Verifikasi email
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile

## 🧪 Testing

### Backend Testing
Jalankan test suite:
```bash
cd backend
npm test
```

Test coverage mencakup:
- Unit tests
- Integration tests
- Security tests
- Rate limiting tests

### Frontend Testing
Jalankan test suite:
```bash
cd frontend
npm test
```

## 🔒 Keamanan

Sistem mengimplementasikan berbagai lapisan keamanan:

1. **Password Security**
   - Hashing dengan bcrypt
   - Validasi kompleksitas
   - Salt rounds yang aman

2. **Session & Token**
   - JWT dengan expiration
   - HTTP-only cookies
   - CSRF protection

3. **Rate Limiting**
   - Brute force protection
   - Request throttling
   - IP-based limiting

4. **Input Validation**
   - Sanitasi input
   - Type checking
   - SQL injection prevention

5. **Security Headers**
   - Helmet.js implementation
   - CORS configuration
   - XSS protection

## 📝 Lisensi

Distribusikan di bawah lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

## 📧 Kontak

Amiruddin - [@amirrdn](https://github.com/amirrdn)

Link Proyek: [https://github.com/amirrdn/security-measure](https://github.com/amirrdn/security-measure)

## 🙏 Ucapan Terima Kasih

### Backend
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

### Frontend
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/) 