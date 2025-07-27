"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../SideBar";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hideLayout = pathname === "/";

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Empêcher le scroll quand le sidebar est ouvert
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sidebarOpen, isMobile]);

  if (hideLayout) {
    return <main>{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen bg-[var(--background)]">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] z-40 p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-[var(--primary)]">NoteManager</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[var(--text)] rounded-md hover:bg-[var(--border)]"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out' : 'fixed left-0 top-0 bottom-0 w-64 z-10'}
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`
        flex-1
        ${isMobile ? 'pt-16' : 'ml-64'}
        p-4 md:p-6
        min-w-0
        transition-spacing duration-300 ease-in-out
      `}>
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}