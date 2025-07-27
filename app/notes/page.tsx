"use client";

import { useEffect, useState } from "react";
import { Note } from "@/lib/types";
import { getNotes, deleteNote } from "@/lib/noteService";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loding";
import toast from "react-hot-toast";
import { FiPlus, FiX, FiSearch, FiFilter } from "react-icons/fi";
import NoteForm from "@/components/forms/NoteForm";
import NoteCard from "@/components/NoteCard";

export default function NotesPage() {
  const { user, token, isLoading } = useAuth();

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
      if (!user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }
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

  if (loading || isLoading) return <Loading />;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
              Mes notes
            </h1>
            {!showForm && (
              <p className="text-[var(--text-light)] text-sm">
                {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} • 
                <span className="hidden sm:inline"> Tout ce qui compte en un seul endroit</span>
              </p>
            )}
          </div>
          
          {!showForm ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-[var(--text-light)]" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] 
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative ">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-8 py-2 border border-[var(--border)] rounded-lg 
                    bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                    focus:border-transparent text-[var(--text)]"
                >
                  <option value="">Tous les statuts</option>
                  <option value="privé">Privé</option>
                  <option value="partagé">Partagé</option>
                  <option value="public">Public</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiFilter className="text-[var(--text-light)]" size={16} />
                </div>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white 
                  rounded-lg hover:bg-[var(--primary)]/90 transition-colors shadow-sm"
              >
                <FiPlus size={18} />
                <span>Nouvelle note</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--border)] text-[var(--text)] 
                rounded-lg hover:bg-[var(--border)]/80 transition-colors w-full sm:w-auto"
            >
              <FiX size={18} />
              <span>Annuler</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {showForm ? (
        <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
            {currentNote ? "Modifier la note" : "Créer une nouvelle note"}
          </h2>
          <NoteForm
            existingNote={currentNote || undefined}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
            showBackButton={false}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {notes.length === 0 ? (
            <div className="text-center py-16 bg-[var(--background)] border border-[var(--border)] rounded-xl p-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">
                  Vous n'avez aucune note
                </h3>
                <p className="text-[var(--text-light)] mb-6">
                  Commencez par créer votre première note pour organiser vos pensées et idées.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white 
                    rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
                >
                  <FiPlus size={18} />
                  <span>Créer une note</span>
                </button>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-[var(--background)] border border-[var(--border)] rounded-xl p-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-3">
                  Aucun résultat trouvé
                </h3>
                <p className="text-[var(--text-light)] mb-6">
                  Aucune note ne correspond à vos critères de recherche.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white 
                    rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
                >
                  <FiSearch size={18} />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}