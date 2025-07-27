"use client";

import { Note } from "@/lib/types";
import { FiEdit, FiTrash2, FiTag, FiEye, FiLink } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("svg") ||
      target.tagName === "BUTTON"
    ) {
      return;
    }
    router.push(`/notes/${note.id}`);
  };

  
  const getStatusColor = () => {
    switch (note.status) {
      case "privé":
        return {
          bg: "bg-[var(--primary)]/10",
          text: "text-[var(--primary)]",
          border: "border-[var(--primary)]/20"
        };
      case "partagé":
        return {
          bg: "bg-[var(--secondary)]/10",
          text: "text-[var(--secondary)]",
          border: "border-[var(--secondary)]/20"
        };
      case "public":
        return {
          bg: "bg-[var(--accent)]/10",
          text: "text-[var(--accent)]",
          border: "border-[var(--accent)]/20"
        };
      default:
        return {
          bg: "bg-[var(--border)]",
          text: "text-[var(--text-light)]",
          border: "border-[var(--border)]"
        };
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      onClick={handleClick}
      className={`relative border rounded-xl p-5 shadow-sm transition-all duration-300 cursor-pointer group overflow-hidden
        ${statusColor.border} hover:shadow-lg bg-[var(--background)]`}
    >
      {/* Effet de fond au hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${statusColor.bg}`}></div>

      <div className="relative z-10 flex flex-col gap-4 h-full">
        {/* En-tête */}
        <div className="flex justify-between items-start gap-3">
          <h2 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {note.title}
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}>
            {note.status}
          </span>
        </div>

        {/* Contenu */}
        <p className="text-sm text-[var(--text)] line-clamp-3 leading-relaxed">
          {note.content}
        </p>

        {/* Pied de carte */}
        <div className="mt-auto space-y-3">
          {/* Lien public */}
          {note.status === "public" && note.public_token && (
            <div className="flex items-center">
              <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <FiLink size={14} />
              </div>
              <a
                href={`${window.location.origin}/public-note/${note.public_token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-[var(--primary)] hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                Voir la note publique
              </a>
            </div>
          )}

          {/* Tags */}
          {note.tags && (
            <div className="flex flex-wrap gap-2">
              {note.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full
                    bg-[var(--border)] text-[var(--text-light)] hover:bg-[var(--border)]/80 transition-colors"
                >
                  <FiTag className="mr-1.5" size={12} />
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all
                bg-[var(--background)] hover:bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--border)]"
              title="Modifier"
            >
              <FiEdit size={16} />
              <span className="sr-only md:not-sr-only">Modifier</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all
                bg-red-50 hover:bg-red-100 text-red-600 border border-red-100"
              title="Supprimer"
            >
              <FiTrash2 size={16} />
              <span className="sr-only md:not-sr-only">Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}