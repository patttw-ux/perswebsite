"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Route shell only — no opacity animation (Framer enter animations were
 * leaving the tree at opacity 0 on some refreshes → “black screen”).
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="relative min-h-screen">
      {children}
    </div>
  );
}
