"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "INDEX", href: "/" },
  { label: "WORK", href: "/#work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "mailto:patwang@umich.edu" },
] as const;

function isActive(pathname: string, href: string) {
  if (href.startsWith("mailto:")) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/#work") {
    return pathname === "/";
  }
  return pathname === href;
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-auto flex gap-8">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-cursor="link"
            className="group relative overflow-hidden font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
          >
            <span className="relative flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 bg-accent transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />
              <span className="relative inline-block h-[1.15em] overflow-hidden">
                <span className="block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  {item.label}
                </span>
                <span className="absolute left-0 top-0 block w-full translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                  {item.label}
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
