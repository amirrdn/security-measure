"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { User } from "@/types/auth";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        console.log(response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container max-w-7xl mx-auto flex h-screen w-screen flex-col items-center justify-center p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm sm:text-base">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-7xl mx-auto flex h-screen w-screen flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
            Sistem Autentikasi
          </h1>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-10 sm:h-12 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200 text-sm sm:text-base text-gray-300"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  size="lg" 
                  className="h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="h-10 sm:h-12 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200 text-sm sm:text-base text-gray-300"
                >
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}
          </div>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8 transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/80">
              <div className="mb-4 rounded-lg bg-blue-500/10 p-3 w-fit">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-200">Verifikasi Email</h3>
            </div>
            <div className="group rounded-2xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8 transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-800/80">
              <div className="mb-4 rounded-lg bg-purple-500/10 p-3 w-fit">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-200">Manajemen Sesi</h3>
            </div>
            <div className="group rounded-2xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8 transition-all duration-300 hover:border-pink-500/50 hover:bg-gray-800/80">
              <div className="mb-4 rounded-lg bg-pink-500/10 p-3 w-fit">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-200">Keamanan Tingkat Tinggi</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
