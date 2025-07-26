import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col space-y-2 w-full max-w-lg mx-auto my-6"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Rechercher par titre ou tag..."
          className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] 
                    focus:border-transparent transition-all text-[#333333]
                    placeholder-[#6C757D] pr-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-[#4A6FA5] text-white 
                    rounded-md hover:bg-[#3A5A8F] transition-all
                    focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] 
                    focus:ring-offset-2"
        >
          Rechercher
        </button>
      </div>
      {query && (
        <p className="text-xs text-[#6C757D] self-end">
          {query.length}/50 caractères
        </p>
      )}
    </form>
  );
};

export default SearchBar;