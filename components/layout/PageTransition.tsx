"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    if (first.current) {
      first.current = false;
      gsap.set(curtain, { yPercent: -100 });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      curtain,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.6, ease: "expo.inOut" },
    ).to(curtain, {
      yPercent: -100,
      duration: 0.6,
      ease: "expo.inOut",
    });
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden
        className="fixed inset-0 z-[150] bg-ink pointer-events-none flex items-center justify-center"
        style={{ transform: "translateY(-100%)" }}
      >
        <span className="font-display text-mares text-6xl tracking-tight">
          MARES
        </span>
      </div>
      {children}
    </>
  );
}
