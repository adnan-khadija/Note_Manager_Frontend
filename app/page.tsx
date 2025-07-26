"use client";
import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function HomePage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Partie gauche - Formulaire (pleine largeur sur mobile, 50% sur desktop) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Logo (plus petit sur mobile) */}
        <div className="mb-6 md:mb-10">
          <Image 
            src="/images/logo.png" 
            alt="Logo de l'application" 
            width={120} 
            height={120}
            className="w-24 h-24 md:w-32 md:h-32"
            priority
          />
          <h1 className="text-3xl md:text-4xl font-bold text-center mt-4">
             Note Manager
          </h1>
        </div>

        {/* Conteneur formulaire */}
        <div className="w-full max-w-md">
          <Toaster position="top-center" />
          
          {/* Formulaire dynamique */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
            {showRegister ? (
              <RegisterForm onSuccess={() => setShowRegister(false)} />
            ) : (
              <LoginForm />
            )}

            {/* Lien de bascule */}
            <div className="text-center mt-4 text-sm">
              {showRegister ? (
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Déjà un compte ? Se connecter
                </button>
              ) : (
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Pas encore de compte ? S'inscrire
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Image (cachée sur mobile, visible sur desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-8 relative">
        {/* Image d'illustration */}
        <Image
          src="/images/image.png"
          alt="Illustration de l'application"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Overlay optionnel pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/10 z-10"></div>
      </div>

      {/* Version mobile de l'image (optionnel) */}
      <div className="md:hidden mt-4 px-6 pb-6">
        <Image
          src="/images/image.png" // Vous pouvez utiliser une version différente pour mobile
          alt="Illustration mobile"
          width={600}
          height={600}
          className="rounded-lg w-full h-auto"
        />
      </div>
    </div>
  );
}