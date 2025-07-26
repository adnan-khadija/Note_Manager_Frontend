"use client";
import Link from "next/link";

export default function Footer() {
  // Utilisation de la même palette de couleurs que le reste de l'application
  const colors = {
    primary: '#4A6FA5',
    secondary: '#6B8C42',
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    text: '#333333',
    lightText: '#6C757D',
    accent: '#FFA630',
    border: '#E0E0E0',
    hover: '#E9ECEF',
    footerBg: '#2D3748', // Un bleu-gris foncé qui s'accorde avec notre thème
    footerText: '#E2E8F0',
  };

  return (
    <footer 
      className="mt-auto border-t"
      style={{
        backgroundColor: colors.footerBg,
        color: colors.footerText,
        borderColor: colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Section copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm sm:text-base">
              © {new Date().getFullYear()} NoteManager. Tous droits réservés.
            </p>
          </div>

          {/* Liens secondaires */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center">
            <Link 
              href="/privacy" 
              className="text-sm sm:text-base hover:underline transition"
              style={{ color: colors.footerText }}
            >
              Confidentialité
            </Link>
            <Link 
              href="/terms" 
              className="text-sm sm:text-base hover:underline transition"
              style={{ color: colors.footerText }}
            >
              Conditions d'utilisation
            </Link>
            <Link 
              href="/contact" 
              className="text-sm sm:text-base hover:underline transition"
              style={{ color: colors.footerText }}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Version et informations supplémentaires */}
        <div className="mt-6 pt-6 border-t text-center text-xs sm:text-sm"
          style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(226, 232, 240, 0.7)'
          }}
        >
          <p>Version 1.0.0</p>
          <p className="mt-1">Conçu pour les étudiants et les enseignants</p>
        </div>
      </div>
    </footer>
  );
}