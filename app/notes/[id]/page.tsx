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
  FiX,
  FiLoader
} from "react-icons/fi";
import MDEditor from "@uiw/react-md-editor";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import NoteForm from "@/components/forms/NoteForm";
import Link from "next/link";

export default function NoteDetailPage() {
  const params = useParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = idParam ? parseInt(idParam, 10) : undefined;
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
      await deleteNote( Number(note.id),token as string);
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
      case "public": return <FiGlobe className="text-[var(--accent)]" />;
      case "partagé": return <FiUsers className="text-[var(--secondary)]" />;
      default: return <FiLock className="text-[var(--primary)]" />;
    }
  };

  const getStatusColor = () => {
    if (!note) return "";
    switch (note.status) {
      case "public": return "bg-[var(--accent)]/10 text-[var(--accent-dark)]";
      case "partagé": return "bg-[var(--secondary)]/10 text-[var(--secondary-dark)]";
      default: return "bg-[var(--primary)]/10 text-[var(--primary-dark)]";
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
      <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-[var(--background)]">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-8 bg-[var(--border)] rounded w-32"></div>
          <div className="h-10 bg-[var(--border)] rounded w-full max-w-xl"></div>
          <div className="flex gap-2">
            <div className="h-4 bg-[var(--border)] rounded w-24"></div>
            <div className="h-4 bg-[var(--border)] rounded w-32"></div>
          </div>
          <div className="h-64 bg-[var(--border)] rounded mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl max-w-md w-full">
          <h2 className="text-xl font-medium mb-2">Erreur</h2>
          <p className="mb-4">{error}</p>
          <Link
            href="/notes"
            className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline font-medium"
          >
            <FiArrowLeft className="mr-2" /> Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-center">
        <div className="bg-[var(--border)] border border-[var(--border)] text-[var(--text-light)] p-6 rounded-xl max-w-md w-full">
          <h2 className="text-xl font-medium mb-2">Note introuvable</h2>
          <p className="mb-4">La note que vous recherchez n'existe pas ou vous n'y avez pas accès.</p>
          <Link
            href="/notes"
            className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline font-medium"
          >
            <FiArrowLeft className="mr-2" /> Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = note.user?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-[var(--background)]">
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isProcessing={isDeleting}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible."
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        {isOwner && !isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors shadow-sm"
            >
              <FiEdit size={18} />
              <span>Modifier</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-dark)] transition-colors shadow-sm"
            >
              <FiTrash2 size={18} />
              <span>Supprimer</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Modifier la note
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-[var(--text-light)] hover:text-[var(--text)] rounded-full hover:bg-[var(--border)] transition-colors"
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
        <article className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          {/* Note Header */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">
                {note.title || "Sans titre"}
              </h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="capitalize">{note.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-light)]">
              <div className="flex items-center gap-2">
                <FiUser className="text-[var(--text-light)]" />
                <span>{note.user?.username || "Auteur inconnu"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-[var(--text-light)]" />
                <span>Mise à jour : {formatDate(note.updated_at)}</span>
              </div>
              {note.tags && (
                <div className="flex items-center gap-2">
                  <FiTag className="text-[var(--text-light)]" />
                  <div className="flex flex-wrap gap-1">
                    {note.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="bg-[var(--border)] px-2.5 py-0.5 rounded-full text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="p-6 prose max-w-none">
            <MDEditor.Markdown source={note.content} />
          </div>

          {/* Shared Users */}
          {note.status === "partagé" && note.shared_with && note.shared_with.length > 0 && (
            <div>
              <h3>Partagée avec :</h3>
              <ul>
                {note.shared_with.map((user) => (
                  <li key={user.id}>{user.username} ({user.email})</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}