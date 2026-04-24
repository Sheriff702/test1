"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function MagneticCTA({ href, label }: { href: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const btn = btnRef.current!;
    const lbl = labelRef.current!;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: "expo.out" });
      gsap.to(lbl, { x: x * 0.15, y: y * 0.15, duration: 0.6, ease: "expo.out" });
    };
    const onLeave = () => {
      gsap.to([btn, lbl], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1,0.35)",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative p-6 -m-6">
      <Link
        ref={btnRef}
        href={href}
        data-cursor="go"
        className="group inline-flex items-center gap-4 px-8 py-4 rounded-full bg-mares text-ink font-display tracking-tight text-lg relative overflow-hidden"
      >
        <span ref={labelRef} className="relative z-10 inline-flex items-center gap-4">
          {label}
          <span className="inline-block transition-transform duration-500 ease-expo group-hover:translate-x-1">
            →
          </span>
        </span>
        <span className="absolute inset-0 bg-ink scale-y-0 origin-bottom transition-transform duration-500 ease-expo group-hover:scale-y-100" />
        <span className="absolute inset-0 flex items-center justify-center gap-4 text-mares opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-expo pointer-events-none">
          {label} →
        </span>
      </Link>
    </div>
  );
}
