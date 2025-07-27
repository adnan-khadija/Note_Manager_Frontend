"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiLock, FiBell, FiMoon, FiSun, FiGlobe } from "react-icons/fi";

export default function SettingsPage() {
  const { user,token } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici vous ajouteriez la logique pour changer le mot de passe
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-8">Paramètres</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section Profil */}
        <div className="bg-[var(--background-secondary)] p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiUser className="text-[var(--primary)] mr-3" size={20} />
            <h2 className="text-xl font-semibold">Profil</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>

        {/* Section Sécurité */}
        <div className="bg-[var(--background-secondary)] p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiLock className="text-[var(--primary)] mr-3" size={20} />
            <h2 className="text-xl font-semibold">Sécurité</h2>
          </div>
          
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
            
            <button
              type="button"
              className="mt-4 px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-dark)] transition-colors"
            >
              Changer le mot de passe
            </button>
          </form>
        </div>

        {/* Section Préférences */}
        <div className="bg-[var(--background-secondary)] p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiBell className="text-[var(--primary)] mr-3" size={20} />
            <h2 className="text-xl font-semibold">Préférences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode sombre</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Activer l'apparence sombre
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                  darkMode ? 'bg-[var(--primary)]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Recevoir des notifications
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                  notifications ? 'bg-[var(--primary)]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section Langue */}
        <div className="bg-[var(--background-secondary)] p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiGlobe className="text-[var(--primary)] mr-3" size={20} />
            <h2 className="text-xl font-semibold">Langue</h2>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setLanguage("fr")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                language === "fr"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--border)]"
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                language === "en"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--border)]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                language === "es"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--border)]"
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}