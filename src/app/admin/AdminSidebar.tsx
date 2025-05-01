"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import config from "@/config";
import {
  LogOut,
  BookOpen,
  Users,
  BarChart,
  ChevronDown,
  ChevronUp,
  FileText,
  Newspaper,
  Book,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ✅ Tambahkan tipe props di sini
interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

interface Transaction {
  id: string;
  status: string;
  borrowDate: string;
  returnDate?: string; // Tambahkan properti opsional jika diperlukan
  borrowerName?: string; // Tambahkan properti opsional lainnya
}

// Helper function to format elapsed time
const formatElapsedTime = (borrowDate: string): string => {
  const borrowDateTime = new Date(borrowDate).getTime();
  const currentTime = Date.now();
  const elapsedMilliseconds = currentTime - borrowDateTime;

  const days = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsedMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [openKoleksi, setOpenKoleksi] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [elapsedTimes, setElapsedTimes] = useState<{ [key: string]: string }>({});

  const handleLogout = async () => {
    try {
      await fetch(`${config.apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include", // agar cookie terkirim & dihapus
      });
    } catch (err) {
      console.error("Gagal logout dari server:", err);
    }
  
    router.replace("/");
  };
  

  useEffect(() => {
    const calculateElapsedTimes = () => {
      return history.reduce((acc, transaction) => {
        if (transaction.status === "borrowed") {
          acc[transaction.id] = formatElapsedTime(transaction.borrowDate);
        }
        return acc;
      }, {} as { [key: string]: string });
    };

    setElapsedTimes(calculateElapsedTimes());
  }, [history]);

  return (
    <>
      {/* Dialog Konfirmasi Logout */}
      <Dialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)}>
        <h2 className="text-lg font-bold mb-2">Konfirmasi Logout</h2>
        <p className="text-sm text-gray-700 mb-4">Apakah Anda yakin ingin logout?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setShowLogoutDialog(false)}>
            Batal
          </Button>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
            Ya, Logout
          </Button>
        </div>
      </Dialog>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#2E2E2E] text-white p-4 z-50 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold">📚 Staff Perpus</h1>
        </div>

        <nav className="space-y-4 flex-1">
          <SidebarLink
            href="/admin/dashboard"
            icon={<BarChart size={20} />}
            label="Dashboard"
            isActive={pathname === "/admin/dashboard"}
          />

          {/* Dropdown Koleksi */}
          <div>
            <button
              onClick={() => setOpenKoleksi(!openKoleksi)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition duration-300 ${
                pathname.includes("/admin/books") || pathname.includes("/admin/penelitian") || pathname.includes("/admin/majalah")
                  ? "bg-[#4A90E2]"
                  : "hover:bg-[#3A3A3A]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen size={20} />
                <span>Koleksi</span>
              </div>
              {openKoleksi ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {openKoleksi && (
              <div className="ml-6 mt-2 space-y-2">
                <SubLink
                  href="/admin/books"
                  label="Buku"
                  icon={<Book size={16} />}
                  isActive={pathname === "/admin/books"}
                />
                <SubLink
                  href="/admin/penelitian"
                  label="Penelitian"
                  icon={<FileText size={16} />}
                  isActive={pathname === "/admin/penelitian"}
                />
                <SubLink
                  href="/admin/majalah"
                  label="Majalah"
                  icon={<Newspaper size={16} />}
                  isActive={pathname === "/admin/majalah"}
                />
              </div>
            )}
          </div>

          <SidebarLink
            href="/admin/users"
            icon={<Users size={20} />}
            label="Manajemen Pengguna"
            isActive={pathname === "/admin/users"}
          />
          <SidebarLink
            href="/admin/loans"
            icon={<BookOpen size={20} />}
            label="Peminjaman"
            isActive={pathname === "/admin/loans"}
          />
          <SidebarLink
            href="/admin/scan"
            icon={<BookOpen size={20} />}
            label="Scan"
            isActive={pathname === "/admin/scan"}
          />
        </nav>

        {/* Tombol Logout */}
        <Button
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-medium mt-6 p-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </Button>
      </aside>
    </>
  );
};

// Komponen Sidebar Link
const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 p-3 rounded-lg transition duration-300 ${
      isActive ? "bg-[#4A90E2]" : "hover:bg-[#3A3A3A]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// SubLink untuk dropdown Koleksi
const SubLink = ({
  href,
  label,
  isActive,
  icon,
}: {
  href: string;
  label: string;
  isActive: boolean;
  icon?: React.ReactNode;
}) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition duration-300 ${
      isActive ? "bg-[#4A90E2]" : "hover:bg-[#3A3A3A]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default AdminSidebar;
