"use client";
import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--background)]">
      {/* Partie formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Contenu dynamique */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-[var(--border)]">
            {showRegister ? (
              <RegisterForm onSuccess={() => setShowRegister(false)} />
            ) : (
              <LoginForm />
            )}

            <div className="mt-6 text-center text-sm text-[var(--text-light)]">
              {showRegister ? (
                <span>
                  Déjà un compte ?{" "}
                  <button
                    onClick={() => setShowRegister(false)}
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    Se connecter
                  </button>
                </span>
              ) : (
                <span>
                  Pas de compte ?{" "}
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    S'inscrire
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partie illustration (desktop seulement) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 items-center justify-center p-12 relative">
        <div className="relative w-full h-full max-w-2xl">
          <Image
            src="/images/image.png"
            alt="Gestion de notes"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute bottom-12 left-12 right-12 text-center">
          <p className="text-xl text-[var(--text)] bg-white/90 px-6 py-3 rounded-lg inline-block shadow-sm">
            "Vos idées, organisées simplement"
          </p>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}