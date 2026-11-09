"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "../../utils/format";
import { Icon } from "../Icon";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";

interface NavItem {
  href: string;
  label: string;
}

function useNavItems(): NavItem[] {
  const { isAuthenticated, isAdmin } = useAuth();
  const items: NavItem[] = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
  ];
  if (isAuthenticated) items.push({ href: "/pedidos", label: "Mis pedidos" });
  if (isAdmin) items.push({ href: "/admin", label: "Administrar" });
  return items;
}

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const navItems = useNavItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-5 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border-2 border-ink bg-surface/90 py-2 pl-4 pr-3 backdrop-blur-md sm:pl-5">
        <Logo />

        <div className="hidden items-center gap-2 md:flex">
          <nav aria-label="Principal">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      isActive(pathname, item.href) ? "bg-lime text-[#17142b]" : "hover:bg-surface-soft",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 place-items-center rounded-full bg-ink text-paper"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} size={19} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-[1.8rem] border-2 border-ink bg-surface p-4 animate-rise md:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block rounded-2xl px-4 py-3 font-semibold",
                    isActive(pathname, item.href) ? "bg-lime text-[#17142b]" : "hover:bg-surface-soft",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
