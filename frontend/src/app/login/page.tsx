"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await api.post("/auth/login", data);
      const { token } = response.data;
      
      localStorage.setItem("auth_token", token);
      
      router.push("/profile");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        setError((err.response as { data: { message: string } }).data.message || "Terjadi kesalahan saat login");
      } else {
        setError("Terjadi kesalahan saat login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-7xl mx-auto flex h-screen w-screen flex-col items-center justify-center p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-4 sm:p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Masukkan email dan password Anda untuk login
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-3 sm:gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs sm:text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className="flex h-9 sm:h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100"
                      placeholder="nama@contoh.com"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="password"
                    className="text-xs sm:text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className="flex h-9 sm:h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.password.message}</p>
                  )}
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Lupa Password?
                    </Link>
                  </div>
                </div>
                {error && (
                  <div className="p-2 sm:p-3 rounded-lg bg-red-900/50 border border-red-800">
                    <p className="text-xs sm:text-sm text-red-400">{error}</p>
                  </div>
                )}
                <Button 
                  className="h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </span>
                  ) : "Login"}
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
              className="h-9 sm:h-10 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200 text-xs sm:text-sm text-gray-300"
              asChild
            >
              <Link href="/register">Daftar akun baru</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 