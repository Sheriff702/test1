export default function Loading() {
  return (
    <div className="fixed inset-0 z-[160] bg-ink flex items-center justify-center">
      <div className="relative">
        <span className="font-display text-6xl tracking-tight text-MARES animate-pulse">
          MARES
        </span>
        <span className="absolute -bottom-6 left-0 right-0 font-mono text-[10px] uppercase tracking-widest text-cream/50 text-center">
          Loading
        </span>
      </div>
    </div>
  );
}
