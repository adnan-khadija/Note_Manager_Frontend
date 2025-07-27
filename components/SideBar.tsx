"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { 
  FiLogOut, 
  FiUser, 
  FiHome, 
  FiFileText, 
  FiShare2, 
  FiSettings
} from "react-icons/fi";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
    onClose?.();
  };

  const navItems = [
    { href: "/home", icon: <FiHome size={20} />, label: "Accueil" },
    { href: "/notes", icon: <FiFileText size={20} />, label: "Mes Notes" },
    { href: "/sharedNotes", icon: <FiShare2 size={20} />, label: "Notes partagées" },
    { href: "/settings", icon: <FiSettings size={20} />, label: "Paramètres" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="h-full w-64 bg-[var(--background)] border-r border-[var(--border)] p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">
          <Link href="/home" onClick={onClose}>NoteManager</Link>
        </h1>
      </div>

      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive(item.href)
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <div className="flex items-center px-4 py-3 mb-4 rounded-lg bg-[var(--primary)]/5 text-[var(--text)]">
          <FiUser className="text-[var(--primary)] mr-3" />
          <span className="font-medium truncate">{user?.username || "Utilisateur"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-colors"
        >
          <FiLogOut className="mr-2" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}