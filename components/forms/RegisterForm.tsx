"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { registerUser } from "@/lib/auth";

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token, user } = await registerUser(username, email, password);

      toast.success("Inscription réussie !");
      login(user, access_token);
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.detail?.includes("already registered")) {
        toast.error("Cet email est déjà enregistré.");
      } else {
        toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        S'inscrire
      </button>
    </form>
  );
}
