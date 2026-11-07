"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "../../utils/format";
import { ButtonLink } from "../Button";
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

function UserArea({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isReady, logout } = useAuth();
  const router = useRouter();

  if (!isReady) return <span className="h-10 w-24" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" onClick={onNavigate} className="px-3 text-sm font-semibold hover:text-coral">
          Entrar
        </Link>
        <ButtonLink href="/register" size="sm" onClick={onNavigate}>
          Crear cuenta
        </ButtonLink>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push("/");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 rounded-full bg-surface-soft py-1 pl-1 pr-3 text-sm font-semibold">
        <span className="grid size-8 place-items-center rounded-full bg-violet font-display text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="grid size-10 place-items-center rounded-full transition hover:bg-coral/15 hover:text-coral"
      >
        <Icon name="logout" size={19} />
      </button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const navItems = useNavItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-5 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border-2 border-ink bg-surface/90 py-2 pl-4 pr-2 backdrop-blur-md sm:pl-5">
        <Logo />

        <nav aria-label="Principal" className="hidden md:block">
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

        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <UserArea />
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
          <div className="mt-3 border-t-2 border-dashed border-line pt-3">
            <UserArea onNavigate={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
}
