import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifikasi Email - Sistem Autentikasi",
  description: "Verifikasi alamat email Anda untuk mengaktifkan akun",
  keywords: "verifikasi email, konfirmasi email, aktivasi akun",
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 