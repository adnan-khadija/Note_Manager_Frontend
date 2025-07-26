"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Note } from "@/lib/types";
import { getNoteById, deleteNote } from "@/lib/noteService";
import { 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2, 
  FiClock, 
  FiUser, 
  FiTag,
  FiLock,
  FiGlobe,
  FiUsers,
  FiX
} from "react-icons/fi";
import MDEditor from "@uiw/react-md-editor";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import NoteForm from "@/components/forms/NoteForm";
import Link from "next/link";

export default function NoteDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? parseInt(params.id[0]) : parseInt(params.id);
  const router = useRouter();
  const { token, user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!token || !id || !user?.id) return;
      setIsLoading(true);
      try {
        const noteData = await getNoteById(token, id, user.id);
        setNote(noteData);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        toast.error("Erreur lors du chargement de la note");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [token, id, user?.id]);

  const handleDelete = async () => {
    if (!note) return;
    setIsDeleting(true);
    try {
      await deleteNote(token, note.id);
      toast.success("Note supprimée avec succès");
      router.push("/notes");
    } catch (err: any) {
      toast.error("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdateSuccess = (updatedNote: Note) => {
    setNote(updatedNote);
    setIsEditing(false);
    toast.success("Note mise à jour avec succès");
  };

  const getStatusIcon = () => {
    if (!note) return null;
    switch (note.status) {
      case "public": return <FiGlobe className="mr-1" />;
      case "partagé": return <FiUsers className="mr-1" />;
      default: return <FiLock className="mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[var(--background)]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[var(--border)] rounded w-1/4 mb-6"></div>
          <div className="h-6 bg-[var(--border)] rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-[var(--border)] rounded w-full mb-1"></div>
          <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-1"></div>
          <div className="h-4 bg-[var(--border)] rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[var(--background)]">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          {error}
        </div>
        <Link
          href="/notes"
          className="mt-4 inline-flex items-center text-[var(--primary)] hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Retour à la liste
        </Link>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-center bg-[var(--background)]">
        <h2 className="text-xl font-medium text-[var(--text-light)] mb-4">
          Note introuvable
        </h2>
        <Link
          href="/notes"
          className="inline-flex items-center text-[var(--primary)] hover:underline"
        >
          <FiArrowLeft className="mr-1" /> Retour à la liste
        </Link>
      </div>
    );
  }

  const isOwner = note.user?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-full flex flex-col bg-[var(--background)]">
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isProcessing={isDeleting}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible."
      />

      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)]"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              <FiEdit className="mr-2" />
              Modifier
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center px-3 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-dark)] transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--primary)]">
              Modifier la note
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-[var(--text-light)] hover:text-[var(--text)] rounded-full hover:bg-[var(--border)]"
            >
              <FiX size={20} />
            </button>
          </div>
          <NoteForm
            existingNote={note}
            onSuccess={handleUpdateSuccess}
            showBackButton={false}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <article className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 flex-grow flex flex-col overflow-hidden">
          <header className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">
                {note.title || "Sans titre"}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                  note.status === "public"
                    ? "bg-[var(--secondary-light)] text-[var(--secondary-dark)]"
                    : note.status === "partagé"
                    ? "bg-[var(--accent-light)] text-[var(--accent-dark)]"
                    : "bg-[var(--border)] text-[var(--text-light)]"
                }`}
              >
                {getStatusIcon()}
                {note.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-light)]">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{note.user?.username || "Auteur inconnu"}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>Mise à jour : {formatDate(note.updated_at)}</span>
              </div>
              {note.tags && (
                <div className="flex items-center">
                  <FiTag className="mr-2" />
                  <div className="flex flex-wrap gap-1">
                    {note.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="bg-[var(--border)] px-2 py-1 rounded-full text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="prose max-w-none flex-grow overflow-y-auto">
            <MDEditor.Markdown source={note.content} />
          </div>

          {note.status === "partagé" &&
            note.shared_with &&
            note.shared_with.length > 0 && (
              <footer className="mt-4 pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--text-light)] mb-2">
                  Partagée avec :
                </h3>
                <div className="flex flex-wrap gap-2">
                  {note.shared_with.map((userId) => {
                    const sharedUser = note.shared_users?.find(
                      (u) => u.id === userId
                    );
                    return (
                      <span
                        key={userId}
                        className="bg-[var(--border)] px-3 py-1 rounded-full text-sm"
                      >
                        {sharedUser?.username || `Utilisateur #${userId}`}
                      </span>
                    );
                  })}
                </div>
              </footer>
            )}
        </article>
      )}
    </div>
  );
}