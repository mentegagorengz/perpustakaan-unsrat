import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import config from "@/config";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ✅ Cek status login saat load (berdasarkan cookie dari /auth/me)
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/auth/me`, {
          credentials: "include",
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Gagal cek status login:", err);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await fetch(`${config.apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
