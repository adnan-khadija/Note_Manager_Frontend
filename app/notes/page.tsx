"use client";

import { useEffect, useState } from "react";
import { Note } from "@/lib/types";
import { getNotes, deleteNote } from "@/lib/noteService";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loding";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit, FiTag, FiPlus, FiX, FiSearch, FiEye } from "react-icons/fi";
import NoteForm from "@/components/forms/NoteForm";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/statusFilter";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      fetchNotes();
    }
  }, [user, isLoading, token]);

  useEffect(() => {
    applyFilters();
  }, [notes, search, status]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes(token as string, user.id, search, status);
      setNotes(data);
      setFilteredNotes(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
      toast.error("Erreur lors du chargement des notes");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const lower = search.toLowerCase();
    const filtered = notes.filter(note => {
      const matchesSearch = lower
        ? note.title.toLowerCase().includes(lower) ||
          note.tags?.toLowerCase().includes(lower)
        : true;
      const matchesStatus = status ? note.status === status : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredNotes(filtered);
  };

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
  };

  const handleFilter = (selectedStatus: string) => {
    setStatus(selectedStatus);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette note ?")) return;
    try {
      await deleteNote(id, token as string);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success("Note supprimée avec succès");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const handleEdit = (note: Note) => {
    setCurrentNote(note);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setCurrentNote(null);
    fetchNotes();
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentNote(null);
  };

  if (loading || isLoading) return <Loading />;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 min-h-screen bg-background">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Mes notes
            </h1>
            {!showForm && (
              <p className="text-text-light text-sm">
                {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} affichée{filteredNotes.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          
          {!showForm ? (
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none md:w-64">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="w-full md:w-48">
                <StatusFilter selectedStatus={status} onStatusChange={handleFilter} />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full md:w-auto justify-center"
              >
                <FiPlus size={18} />
                <span>Nouvelle note</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-foreground rounded-lg hover:bg-gray-300 transition-colors w-full md:w-auto justify-center"
            >
              <FiX size={18} />
              <span>Annuler</span>
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="mb-8 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {currentNote ? "Modifier la note" : "Nouvelle note"}
            </h2>
          </div>
          <NoteForm
            existingNote={currentNote || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            showBackButton={false}
          />
        </div>
      ) : (
        <>
          {notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border p-6 max-w-md mx-auto">
              <p className="text-lg text-text-light mb-4">Vous n'avez aucune note</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
              >
                <FiPlus size={18} />
                <span>Créer votre première note</span>
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border p-6 max-w-md mx-auto">
              <p className="text-lg text-text-light mb-4">Aucune note ne correspond à votre recherche</p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
              >
                <FiSearch size={18} />
                <span>Réinitialiser les filtres</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.closest("button") ||
                      target.closest("svg") ||
                      target.tagName === "BUTTON"
                    ) {
                      return;
                    }
                    router.push(`/notes/${note.id}`);
                  }}
                  className="border border-border rounded-lg bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {note.title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 ${
                          note.status === 'privé' ? 'bg-secondary/10 text-secondary-dark' :
                          note.status === 'partagé' ? 'bg-accent/10 text-accent-dark' :
                          'bg-border text-text-light'
                        }`}>
                          {note.status}
                        </span>
                      </div>
                      <p className="text-text mb-4 whitespace-pre-line line-clamp-3">
                        {note.content}
                      </p>

                      {note.status === "public" && note.public_token && (
                        <div className="mt-2 flex items-center">
                          <FiEye className="text-text-light mr-2" size={14} />
                          <a
                            href={`${window.location.origin}/public-note/${note.public_token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 hover:underline text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Lien public
                          </a>
                        </div>
                      )}

                      {note.tags && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {note.tags.split(',').map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center text-xs text-text-light bg-border px-2.5 py-0.5 rounded-full"
                            >
                              <FiTag className="mr-1" size={12} />
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 self-end md:self-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors bg-primary/10 text-primary hover:bg-primary/20"
                        title="Modifier"
                      >
                        <FiEdit size={16} />
                        <span className="md:hidden">Modifier</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                        title="Supprimer"
                      >
                        <FiTrash2 size={16} />
                        <span className="md:hidden">Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}