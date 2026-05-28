import "../globals.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed, endSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  await endSession();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page is allowed without auth — handled by login page itself.
  // For all other admin pages, redirect if not authed.
  // We can't read pathname in a server layout, so we let the login page no-op
  // and use a separate guard in each page that needs auth (or rely on layout).
  // Strategy: this layout assumes auth required; the login page uses its own
  // bare layout via being a route group. Simpler: check here and redirect.
  return (
    <div className="min-h-screen bg-ink text-cream font-sans">
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}

async function AdminChrome({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();
  return (
    <>
      {authed ? (
        <header className="sticky top-0 z-30 bg-ink/90 backdrop-blur border-b border-cream/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/admin" className="font-display text-xl tracking-tight">
              MARES <span className="text-mares">/ admin</span>
            </Link>
            <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
              <Link href="/admin" className="text-cream/70 hover:text-mares transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-cream/70 hover:text-mares transition-colors">
                Products
              </Link>
              <Link href="/" target="_blank" className="text-cream/70 hover:text-mares transition-colors">
                View site ↗
              </Link>
              <form action={logoutAction}>
                <button className="text-cream/70 hover:text-blood transition-colors" type="submit">
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </>
  );
}
