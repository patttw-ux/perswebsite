"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MAX_DIST = 80;
const STRENGTH = 0.35;

export default function MagneticRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".magnetic");
    const cleanups: Array<() => void> = [];

    elements.forEach((el) => {
      gsap.set(el, { x: 0, y: 0 });

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

      const onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > MAX_DIST) {
          xTo(0);
          yTo(0);
          return;
        }

        xTo(dx * STRENGTH);
        yTo(dy * STRENGTH);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
        gsap.set(el, { clearProps: "transform" });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
