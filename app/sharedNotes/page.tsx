'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Note } from "@/lib/types";
import { getSharedNotes } from "@/lib/noteService";
import { FiUsers, FiFileText, FiClock } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";

export default function SharedNotesPage() {
  const { token,user} = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchNotes() {
      if (!token) return;
      setIsLoading(true);
      try {
        const sharedNotes = await getSharedNotes(token,user.id);
        setNotes(sharedNotes);
      } catch (err: any) {
        setError(err.message);
        toast.error("Erreur lors du chargement des notes partagées");
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotes();
  }, [token]);
  console.log("Notes partagées:", notes); // Debug

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <FiUsers className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <FiUsers className="text-2xl mr-3 text-[var(--primary)]" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Notes partagées avec moi
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">
            Aucune note partagée avec vous
          </h3>
          <p className="text-gray-400 mt-1">
            Les notes que d'autres utilisateurs partagent avec vous apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <Link 
              href={`/notes/${note.id}`} 
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-[var(--primary)] transition-colors hover:shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg text-gray-800 line-clamp-1">
                  {note.title || "Sans titre"}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {note.user?.username || "Auteur inconnu"}
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-600 mb-3 line-clamp-3">
                <MDEditor.Markdown source={note.content} />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                
                {note.tags && (
                  <div className="truncate max-w-[120px]">
                    {note.tags.split(',').map(tag => (
                      <span key={tag} className="inline-block bg-gray-100 rounded px-1 mr-1">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}