import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Sistem Autentikasi",
  description: "Atur ulang password akun Anda",
  keywords: "reset password, lupa password, ganti password, keamanan akun",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 