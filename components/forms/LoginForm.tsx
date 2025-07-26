"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { user, access_token } = await loginUser(email, password);
      login(user, access_token); 
      toast.success("Connexion réussie");
      router.push("/home"); 
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la connexion");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2 className="text-2xl font-semibold mb-4">Connexion</h2>

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
        className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded hover:bg-[var(--text-light)]"
      >
        Se connecter
      </button>
    </form>
  );
}
