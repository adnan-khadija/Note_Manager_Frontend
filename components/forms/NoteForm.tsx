"use client";

import { useState, useEffect } from "react";
import { Note, User } from "@/lib/types";
import { createNote, updateNote } from "@/lib/noteService";
import { useAuth } from "@/context/AuthContext";
import { FiSave, FiTag, FiType, FiEdit2, FiX, FiUsers, FiLock, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { getUsers } from "@/lib/auth";
import { p } from "framer-motion/client";

interface NoteFormProps {
  existingNote?: Note;
  onSuccess: (note: Note) => void;
  showBackButton?: boolean;
  onCancel?: () => void;
}

export default function NoteForm({
  existingNote,
  onSuccess,
  showBackButton = true,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");
  const [tags, setTags] = useState(existingNote?.tags || "");
  const [status, setStatus] = useState(existingNote?.status || "privé");
  const [error, setError] = useState("");
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]); 
  const [sharedWith, setSharedWith] = useState<number[]>(existingNote?.shared_with || []); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers(token as string);
        setUsers(data);
      } catch (error) {
        console.error("Erreur récupération utilisateurs :", error);
        toast.error("Erreur lors du chargement des utilisateurs");
      }
    }
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const toastId = toast.loading(
      existingNote 
        ? "Mise à jour de la note en cours..." 
        : "Création de la note en cours...",
      {
        position: "top-center"
      }
    );

    try {
      const noteData = {
        title,
        content,
        tags,
        status,
        user: user,
        sharedWith: sharedWith.length > 0 ? sharedWith : undefined,
        public_token: existingNote?.public_token || undefined,
      };

      let result;
      if (existingNote) {
        result = await updateNote(token, existingNote.id, noteData);
        toast.success("Note mise à jour avec succès", {
          id: toastId,
          icon: '✅',
          duration: 4000
        });
      } else {
        result = await createNote(token, noteData);
        toast.success("Note créée avec succès", {
          id: toastId,
          icon: '✨',
          duration: 4000
        });
      }

      onSuccess(result);
    } catch (err: any) {
      console.error("Erreur:", err);
      const errorMsg = err.message || "Erreur lors de l'enregistrement";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: toastId,
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) {
      toast("Veuillez patienter pendant l'enregistrement", {
        icon: '⏳',
        duration: 2000
      });
      return;
    }

    if (onCancel) {
      onCancel();
    } else if (existingNote) {
      window.history.back();
    } else {
      onSuccess({} as Note);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "public": return <FiGlobe className="mr-1" />;
      case "partagé": return <FiUsers className="mr-1" />;
      default: return <FiLock className="mr-1" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6" data-color-mode="light">
      {/* En-tête améliorée avec boutons mieux organisés */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div className="flex flex-col-reverse md:flex-row gap-3 w-full md:w-auto">
          {showBackButton && (
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-[var(--border)] transition-colors w-full md:w-auto ${
                isSubmitting 
                  ? "bg-gray-100 cursor-not-allowed" 
                  : "hover:bg-gray-50"
              }`}
            >
              <FiX />
              <span>Annuler</span>
            </button>
          )}
          
          <button
            type="submit"
            form="note-form"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg transition-colors w-full md:w-auto ${
              isSubmitting 
                ? "opacity-75 cursor-not-allowed" 
                : "hover:bg-[var(--primary-dark)]"
            }`}
          >
            <FiSave />
            <span>
              {isSubmitting 
                ? "Enregistrement..." 
                : existingNote 
                  ? "Mettre à jour" 
                  : "Enregistrer"}
            </span>
          </button>
        </div>
      </div>

      {/* Formulaire avec meilleure hiérarchie visuelle */}
      <form
        id="note-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-4 md:p-6 space-y-6"
      >
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
            <FiX className="mr-2" /> {error}
          </div>
        )}

        {/* Section Titre */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-600">
            <FiType className="mr-2" /> Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Donnez un titre à votre note"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Section Contenu avec prévisualisation Markdown */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-600">
            <FiEdit2 className="mr-2" /> Contenu
          </label>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <MDEditor
              value={content}
              onChange={setContent}
              height={400}
              preview="edit"
              textareaProps={{
                placeholder: "Écrivez votre note ici en Markdown...",
                disabled: isSubmitting
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Utilisez la syntaxe Markdown pour formater votre texte
          </p>
        </div>

        {/* Section Métadonnées en grille responsive */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Tags */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <FiTag className="mr-2" /> Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex: travail, important, idées"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Séparez les tags par des virgules
            </p>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              {getStatusIcon()} Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent appearance-none bg-white"
              disabled={isSubmitting}
            >
              <option value="public">Public (visible par tous)</option>
              <option value="partagé">Partagé (sélection d'utilisateurs)</option>
              <option value="privé">Privé (seulement moi)</option>
            </select>
          </div>
        </div>

        {/* Section Partage conditionnelle */}
        {status === "partagé" && (
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-600">
              <FiUsers className="mr-2" /> Partager avec
            </label>
            <select
              multiple
              value={sharedWith.map(String)}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions);
                const selectedIds = selectedOptions.map(option => parseInt(option.value));
                setSharedWith(selectedIds);
              }}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent min-h-[100px]"
              disabled={isSubmitting}
            >
              {users.map(user => (
                <option key={user.id} value={user.id.toString()}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs utilisateurs
            </p>
          </div>
        )}

        {/* Boutons en bas de formulaire - visible seulement sur mobile */}
        <div className="md:hidden flex justify-end gap-3 pt-4">
          {showBackButton && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm rounded-lg border border-gray-200 ${
                isSubmitting ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg ${
              isSubmitting ? "opacity-75" : "hover:bg-[var(--primary-dark)]"
            }`}
          >
            {isSubmitting ? "Enregistrement..." : existingNote ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}