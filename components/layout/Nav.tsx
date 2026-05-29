"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { PreferencesSwitcher } from "./PreferencesSwitcher";
import { usePreferences } from "@/lib/preferences";
import { logoutAction } from "@/app/admin/admin-actions";

const PUBLIC_LINKS = [
  { href: "/shop", key: "shop" as const },
  { href: "/lookbook", key: "lookbook" as const },
  { href: "/about", key: "about" as const },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/design", label: "Design" },
];

export function Nav({ adminAuthed = false }: { adminAuthed?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const openCart = useCart((s) => s.open);
  const count = useCart((s) => s.count());
  const { t } = usePreferences();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const showAdminLinks = isAdmin && adminAuthed;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo backdrop-blur-md",
        scrolled
          ? "bg-ink/80 border-b border-cream/10 py-3"
          : "bg-ink/30 py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          href={showAdminLinks ? "/admin" : "/"}
          data-cursor="home"
          className="font-display text-2xl tracking-tight leading-none flex items-center gap-2"
        >
          MARES<span className="text-mares">.</span>
          {showAdminLinks ? (
            <span className="font-mono text-[10px] uppercase tracking-widest text-mares/80 border border-mares/40 rounded px-1.5 py-0.5 leading-none">
              admin
            </span>
          ) : null}
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {showAdminLinks
            ? ADMIN_LINKS.map((link) => (
                <AdminLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href))}
                />
              ))
            : PUBLIC_LINKS.map((link) => (
                <MagneticLink key={link.href} href={link.href} label={t(link.key)} />
              ))}
        </nav>

        <div className="flex items-center gap-4">
          {showAdminLinks ? (
            <>
              <Link
                href="/"
                target="_blank"
                data-cursor="view"
                className="font-mono text-[10px] uppercase tracking-widest text-cream/70 hover:text-mares transition-colors"
              >
                View site ↗
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-mono text-[10px] uppercase tracking-widest text-cream/70 hover:text-blood transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <PreferencesSwitcher />
              <button
                data-cursor="cart"
                onClick={openCart}
                className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 group"
              >
                <span>{t("cart")}</span>
                <span className="w-6 h-6 rounded-full border border-cream/40 text-[10px] flex items-center justify-center group-hover:bg-mares group-hover:text-ink group-hover:border-mares transition-colors">
                  {mounted ? count : 0}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function AdminLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean | "";
}) {
  return (
    <Link
      href={href}
      data-cursor="view"
      className={cn(
        "relative font-mono text-xs uppercase tracking-widest transition-colors after:absolute after:left-0 after:-bottom-1 after:w-full after:h-px after:bg-mares after:origin-left after:transition-transform after:duration-500 after:ease-expo inline-block",
        active
          ? "text-mares after:scale-x-100"
          : "text-cream/80 hover:text-cream after:scale-x-0 hover:after:scale-x-100",
      )}
    >
      {label}
    </Link>
  );
}

function MagneticLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "expo.out" });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      data-cursor="view"
      className="relative font-mono text-xs uppercase tracking-widest text-cream/80 hover:text-cream transition-colors after:absolute after:left-0 after:-bottom-1 after:w-full after:h-px after:bg-mares after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-expo inline-block"
    >
      {label}
    </Link>
  );
}
