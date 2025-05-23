import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - Sistem Autentikasi",
  description: "Buat akun baru untuk mengakses sistem autentikasi",
  keywords: "daftar, register, buat akun, autentikasi",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 