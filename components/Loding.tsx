// components/Loading.jsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div
        className="w-12 h-12 border-8 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"
        role="status"
        aria-label="loading"
      ></div>
      <span className="mt-4 font-semibold text-lg">Chargement...</span>
    </div>
  );
}
