"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/auth";
import api from "@/lib/axios";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("auth_token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("auth_token");
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container flex h-screen w-screen flex-col items-center justify-center p-4">
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-7xl mx-auto flex h-screen w-screen flex-col items-center justify-center p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:space-y-6 sm:w-[400px] p-4 sm:p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Selamat datang!
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Anda telah berhasil login sebagai {user.email}
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-200">Informasi Akun</h2>
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                <p>
                  <span className="font-medium text-gray-200">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium text-gray-200">Status:</span>{" "}
                  <span className={user.is_verified ? "text-green-400" : "text-yellow-400"}>
                    {user.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-200">Terdaftar pada:</span>{" "}
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                onClick={() => router.push('/')}
              >
                Dashboard
              </Button>

              <Button 
                className="flex-1 h-9 sm:h-10 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 