type Props = {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  className?: string;
};

export default function StatusFilter({ selectedStatus, onStatusChange, className }: Props) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* En-tête du filtre */}
      <div className="flex items-center justify-between">
        <label className="text-sm md:text-base font-medium text-[var(--text)]">
          Filtrer par statut
        </label>
        <span className="text-xs md:text-sm text-[var(--text-light)] bg-[var(--border)] px-2.5 py-1 rounded-full">
          {selectedStatus || "Tous"}
        </span>
      </div>
      
      {/* Sélecteur - version dropdown pour mobile et desktop */}
      <div className="relative">
        <select
          className="appearance-none w-full pl-3 pr-8 py-2.5 md:py-3 border border-[var(--border)] rounded-lg 
            bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 
            focus:ring-[var(--primary)] focus:border-transparent transition-all cursor-pointer
            hover:border-[var(--primary)]/30 shadow-sm text-sm md:text-base"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="public">Public</option>
          <option value="partagé">Partagé</option>
          <option value="privé">Privé</option>
        </select>
        
        {/* Icône de flèche */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className="w-5 h-5 text-[var(--text-light)]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>
      </div>
      
      {/* Info-bulle - version responsive */}
      <div className="flex items-start gap-1.5 text-xs md:text-sm text-[var(--text-light)]">
        <svg 
          className="w-4 h-4 flex-shrink-0 mt-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="flex-1">Sélectionnez un statut de visibilité</span>
      </div>
    </div>
  );
}