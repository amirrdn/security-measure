import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password - Sistem Autentikasi",
  description: "Dapatkan link untuk mengatur ulang password Anda",
  keywords: "lupa password, reset password, pemulihan akun, keamanan",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 