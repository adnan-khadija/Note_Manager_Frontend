"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../SideBar";
import { useEffect, useState } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const hideLayout = pathname === "/";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (hideLayout) {
    return <main>{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen bg-[var(--background)]">
      {/* Sidebar - fixed on desktop, overlay on mobile */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-40' : 'static'}
        ${isMobile ? 'transform transition-transform' : ''}
        ${isMobile ? 'translate-x-0' : ''}
      `}>
        <Sidebar />
      </div>

      {/* Main content with proper spacing */}
      <main className={`
        flex-1
        ${isMobile ? 'mt-16' : 'ml-64'} // Margin left on desktop, margin top on mobile
        p-4 md:p-6
        transition-all duration-300
        min-w-0 // Prevent overflow
        z-10 // Ensure content stays above mobile sidebar overlay when closed
      `}>
        {/* Container for consistent max-width */}
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile header - fixed at top */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] z-30 p-4">
          <h1 className="text-xl font-bold text-[var(--primary)]">NoteManager</h1>
        </header>
      )}
    </div>
  );
}