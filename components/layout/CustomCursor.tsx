"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      const type = target.dataset.cursor || "hover";
      gsap.to(ring, { scale: 2.4, backgroundColor: "rgba(198,242,78,0.12)", borderColor: "#c6f24e", duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 0, duration: 0.3 });
      label.textContent = type === "hover" ? "" : type.toUpperCase();
      gsap.to(label, { opacity: 1, duration: 0.3 });
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      gsap.to(ring, { scale: 1, backgroundColor: "rgba(255,255,255,0)", borderColor: "rgba(244,239,230,0.5)", duration: 0.4, ease: "expo.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cream mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[199] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-cream/50 flex items-center justify-center mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="text-[10px] font-mono uppercase tracking-wider opacity-0 text-cream"
        />
      </div>
    </>
  );
}
