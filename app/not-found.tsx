import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-volt mb-4">
        / 404
      </p>
      <h1 className="font-display text-8xl md:text-10xl tracking-tighter leading-none">
        Lost.
      </h1>
      <p className="mt-6 text-cream/60 max-w-md">
        This page isn&apos;t on the rack. Head back to the shop.
      </p>
      <Link
        href="/"
        data-cursor="home"
        className="mt-10 inline-flex items-center gap-3 bg-volt text-ink font-display text-lg px-8 py-4 rounded-full"
      >
        Home →
      </Link>
    </div>
  );
}
