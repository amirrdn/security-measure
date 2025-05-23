"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token verifikasi tidak ditemukan");
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setSuccess("Email berhasil diverifikasi! Silakan login untuk melanjutkan.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
          setError((err.response as { data: { message: string } }).data.message || "Terjadi kesalahan saat memverifikasi email");
        } else {
          setError("Terjadi kesalahan saat memverifikasi email");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="w-full md:max-w-[400px] rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm shadow-lg sm:p-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              Verifikasi Email
            </h1>
            <p className="text-xs text-gray-400 sm:text-sm">
              Mohon tunggu sebentar, kami sedang memverifikasi email Anda
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 sm:h-16 sm:w-16"></div>
                <p className="text-xs text-gray-400 sm:text-sm">Memverifikasi email...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/50 p-3 sm:p-4">
                <p className="text-xs text-red-400 sm:text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-800 bg-green-900/50 p-3 sm:p-4">
                <p className="text-xs text-green-400 sm:text-sm">{success}</p>
              </div>
            )}

            {!isLoading && !success && (
              <Button 
                variant="outline" 
                className="h-9 border-2 border-gray-700 text-xs text-gray-300 transition-all duration-200 hover:border-gray-600 hover:bg-gray-700/50 sm:h-10 sm:text-sm"
                asChild
              >
                <Link href="/login">Kembali ke Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex h-screen w-full items-center justify-center p-4">
          <div className="w-full md:max-w-[400px] rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm shadow-lg sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 sm:h-16 sm:w-16"></div>
              <p className="text-xs text-gray-400 sm:text-sm">Memuat halaman...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 