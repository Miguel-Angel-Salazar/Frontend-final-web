import Link from "next/link";
import { Logo } from "../Logo";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/pedidos", label: "Mis pedidos" },
  { href: "/register", label: "Crear cuenta" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 rounded-t-[3rem] bg-[#17142b] px-6 pb-8 pt-14 text-[#f4efe6] sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-sm text-[#f4efe6]/70">
            Juegos, consolas, accesorios y figuras de tus personajes favoritos. Elige, pide y vuelve a jugar.
          </p>
        </div>
        <nav aria-label="Enlaces del pie de página">
          <ul className="grid grid-cols-2 gap-3 text-sm font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[#f4efe6]/80 transition hover:text-[#c8f169]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-[#f4efe6]/50">
        Respawn · Proyecto de aula de Desarrollo Web Full-Stack, 2026-2.
      </p>
    </footer>
  );
}
