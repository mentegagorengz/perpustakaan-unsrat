"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import config from "@/config";

// Tipe payload kustom dengan properti role
interface MyJwtPayload extends JwtPayload {
  role?: string;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Coba panggil /auth/me untuk cek login dari cookie
    const checkLogin = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
  
        if (!res.ok) return;
  
        const user = await res.json();
        const role = user.role?.toLowerCase();
  
        if (user.type === "staff" && role === "admin") {
          router.replace("/admin/dashboard");
        } else if (user.type === "staff") {
          router.replace("/staff/dashboard");
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.log("Not logged in");
      }
    };
  
    checkLogin();
  }, [router]);  

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

    const handleLogin = async () => {
      if (!email || !password) {
        setError("Email dan password harus diisi!");
        return;
      }
    
      setLoading(true);
      setError("");
    
      try {
        // LOGIN STAFF
        const response = await fetch(`${config.apiUrl}/auth/staff/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // agar cookie access_token terkirim
          body: JSON.stringify({ email, password }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login gagal.");
        }
    
        // FETCH DATA ME
        const resUser = await fetch(`${config.apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
    
        const user = await resUser.json();
        console.log("✅ /auth/me response:", user);
    
        if (user.type === "staff") {
          const role = user.role?.toLowerCase();
          if (role === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/staff/dashboard");
          }
        } else {
          // Kalau bukan staff (misalnya nanti ada user biasa)
          router.replace("/");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-[#1f2023] mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#1f2023] text-white py-3 rounded-lg mb-3"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
