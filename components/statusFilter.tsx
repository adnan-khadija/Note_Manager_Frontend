type Props = {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
};

export default function StatusFilter({ selectedStatus, onStatusChange }: Props) {
  return (
    <div className="flex flex-col space-y-1 w-full max-w-xs">
      <label className="text-sm font-medium text-[#333333]">Statut</label>
      <select
        className="border border-[#E0E0E0] p-2 rounded-md text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] focus:border-transparent transition-all cursor-pointer"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="" className="text-[#6C757D]">Tous les statuts</option>
        <option value="public" className="text-[#333333]">Public</option>
        <option value="partagé" className="text-[#333333]">Partagé</option>
        <option value="privé" className="text-[#333333]">Privé</option>
      </select>
      <p className="text-xs text-[#6C757D]">Filtrez par statut de visibilité</p>
    </div>
  );
}