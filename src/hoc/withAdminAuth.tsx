"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/config";

export default function withAdminAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const verify = async () => {
        try {
          const res = await fetch(`${config.apiUrl}/auth/me`, {
            method: "GET",
            credentials: "include", // ⬅️ agar cookie terkirim
          });

          if (!res.ok) throw new Error("Unauthorized");

          const user = await res.json();

          if (user.role?.toLowerCase() === "admin") {
            setAuthorized(true);
          } else {
            console.warn("❌ Bukan admin, redirect ke /peminjaman");
            router.replace("/peminjaman");
          }
        } catch (err) {
          console.error("❌ Gagal verifikasi token:", err);
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      };

      verify();
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg font-semibold">Memverifikasi akses admin...</p>
        </div>
      );
    }

    return authorized ? <Component {...props} /> : null;
  };
}
