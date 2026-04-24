"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const curtain = curtainRef.current!;
    const content = contentRef.current!;

    if (first.current) {
      first.current = false;
      gsap.set(curtain, { yPercent: -100 });
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.1 },
      );
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      curtain,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.7, ease: "expo.inOut" },
    )
      .set(content, { opacity: 0, y: 20 })
      .to(curtain, {
        yPercent: -100,
        duration: 0.7,
        ease: "expo.inOut",
      })
      .to(content, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.5");
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[150] bg-ink pointer-events-none flex items-center justify-center"
        style={{ transform: "translateY(-100%)" }}
      >
        <span className="font-display text-mares text-6xl tracking-tight">MARES</span>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}
