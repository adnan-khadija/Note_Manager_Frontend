"use client";

import { useState } from "react";
import NoteForm from "@/components/forms/NoteForm";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiBook, FiPlus, FiShare2, FiClock, FiX } from "react-icons/fi";

export default function HomePage() {
  const { user } = useAuth();
  const [showNoteForm, setShowNoteForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Bonjour, {user?.username} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Que souhaitez-vous faire aujourd'hui ?
        </p>
      </div>

      {/* Actions principales */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link
          href="/notes"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiBook className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Voir mes notes</h2>
              <p className="text-gray-500 text-sm">Accéder à toutes vos notes</p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setShowNoteForm(true)}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FiPlus className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Nouvelle note</h2>
              <p className="text-gray-500 text-sm">Créer une nouvelle note</p>
            </div>
          </div>
        </button>

        <Link
          href="/sharedNotes"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiShare2 className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Notes partagées</h2>
              <p className="text-gray-500 text-sm">Voir les notes partagées avec vous</p>
            </div>
          </div>
        </Link>

        
      </div>

      {/* Formulaire de note modale */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nouvelle note</h2>
                <button 
                  onClick={() => setShowNoteForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <NoteForm 
                onSuccess={() => {
                  setShowNoteForm(false);
                  // Optionnel: recharger les données si nécessaire
                }} 
                onCancel={() => setShowNoteForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}