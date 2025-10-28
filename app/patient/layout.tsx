"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Upload, Share2, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import "@/app/globals.css";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch on first render

  const navItems = [
    { name: "Dashboard", href: "/patient/dashboard", icon: FileText },
    { name: "Upload", href: "/patient/upload", icon: Upload },
    { name: "Shared", href: "/patient/shared", icon: Share2 },
    { name: "Profile", href: "/patient/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar (Desktop + Mobile) */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 shadow-lg md:shadow-md p-5 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600">MedVault</h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-200 dark:bg-blue-700 font-semibold text-blue-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
