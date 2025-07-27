import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative ${className}`}
    >
      <div className="relative">
        {/* Icône de recherche */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-[var(--text-light)]" size={20} />
        </div>

        {/* Champ de recherche */}
        <input
          type="text"
          placeholder="Rechercher des notes..."
          className="w-full pl-10 pr-24 py-3 border border-[var(--border)] rounded-xl
                    bg-[var(--background)] text-[var(--text)] placeholder-[var(--text-light)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                    focus:border-transparent transition-all shadow-sm
                    hover:border-[var(--primary)]/30"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={50}
        />

        {/* Bouton de réinitialisation */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-24 flex items-center pr-3
                      text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            aria-label="Effacer la recherche"
          >
            <FiX size={18} />
          </button>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 m-1 bg-[var(--primary)] text-white 
                    rounded-lg hover:bg-[var(--primary)]/90 transition-all
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)] 
                    focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          <span className="hidden sm:inline">Rechercher</span>
          <FiSearch size={18} className="sm:hidden" />
        </button>
      </div>

      {/* Compteur de caractères */}
      {query && (
        <div className="absolute -bottom-5 right-0 text-xs text-[var(--text-light)]">
          <span className={query.length > 45 ? "text-[var(--accent)]" : ""}>
            {query.length}
          </span>
          /50
        </div>
      )}
    </form>
  );
};

export default SearchBar;