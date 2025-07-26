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
  FiMenu, 
  FiX,
  FiSettings
} from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setOpen(false);
  };

  const navItems = [
    { href: "/home", icon: <FiHome size={20} />, label: "Accueil" },
    { href: "/notes", icon: <FiFileText size={20} />, label: "Mes Notes" },
    { href: "/sharedNotes", icon: <FiShare2 size={20} />, label: "Notes partagées" },
    { href: "/settings", icon: <FiSettings size={20} />, label: "Paramètres" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-[var(--background)] border-r border-[var(--border)] p-6 z-30">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            <Link href="/home">NoteManager</Link>
          </h1>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Mobile Header (always visible on mobile) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[var(--background)] border-b border-[var(--border)] sticky top-0 z-20">
        <h1 className="text-xl font-bold text-[var(--primary)]">NoteManager</h1>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="p-2 rounded-md text-[var(--text)] hover:bg-[var(--primary)]/10"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-[var(--background)] border-r border-[var(--border)] z-50 flex flex-col p-6 transition-transform ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold text-[var(--primary)]">NoteManager</h1>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-[var(--primary)]/10"
              >
                <FiX size={20} />
              </button>
            </div>

            <nav className="flex flex-col space-y-2 flex-grow">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
                <span className="font-medium">{user?.username || "Utilisateur"}</span>
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
        </>
      )}

      {/* Add padding for mobile content to avoid overlap */}
      {isMobile && <div className="pb-16"></div>}
    </>
  );
}