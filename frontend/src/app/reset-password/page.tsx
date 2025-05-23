"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Suspense } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password tidak cocok");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/reset-password/confirm", {
        token,
        password,
      });
      setMessage("Password berhasil direset. Silakan login dengan password baru.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.message || "Terjadi kesalahan. Token tidak valid atau sudah kadaluarsa.");
      } else {
        setMessage("Terjadi kesalahan. Token tidak valid atau sudah kadaluarsa.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Token Tidak Valid
              </h1>
              <p className="text-sm text-gray-400">
                Link reset password tidak valid atau sudah kadaluarsa
              </p>
            </div>
            <Button 
              className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              asChild
            >
              <Link href="/forgot-password">Minta Link Reset Baru</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-7xl mx-auto flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-sm text-gray-400">
              Masukkan password baru Anda
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className="flex h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-300"
                  >
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      className="flex h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {message && (
                  <div className="p-3 rounded-lg bg-green-900/50 border border-green-800">
                    <p className="text-sm text-green-400">{message}</p>
                  </div>
                )}
                <Button 
                  className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengirim...
                    </span>
                  ) : "Reset Password"}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">
                  Atau
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="h-10 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200 text-gray-300"
              asChild
            >
              <Link href="/login">Kembali ke Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
