import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Sistem Autentikasi",
  description: "Kelola akun dan informasi profil Anda",
  keywords: "dashboard, profil, pengaturan akun, autentikasi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 