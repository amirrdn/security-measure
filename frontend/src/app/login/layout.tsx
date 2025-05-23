import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Sistem Autentikasi",
  description: "Masuk ke akun Anda untuk mengakses sistem autentikasi",
  keywords: "login, masuk, autentikasi, sistem login",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 