import type { Metadata } from "next";
import { CatalogView } from "@/features/products/components/CatalogView";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora videojuegos, consolas, accesorios y figuras coleccionables.",
};

export default function CatalogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="font-semibold text-coral">Inventario en línea</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Explora el <span className="squiggle">catálogo</span>
          </h1>
        </div>
        <p className="max-w-sm text-sm text-muted">
          Combina búsqueda, categoría, plataforma y rango de precio para ir directo a lo que quieres jugar.
        </p>
      </header>

      <CatalogView />
    </main>
  );
}
