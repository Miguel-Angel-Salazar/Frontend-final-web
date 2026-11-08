import { ButtonLink } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-8">
      <div className="relative mb-8">
        <span className="inline-block -rotate-6 rounded-[2.2rem_2.2rem_2.2rem_0.6rem] border-2 border-ink bg-sun px-8 py-4 font-display text-6xl font-extrabold text-[#17142b] shadow-[6px_6px_0_0_var(--ink)] sm:text-7xl">
          404
        </span>
        <span className="absolute -bottom-3 -right-6 rotate-6 rounded-full border-2 border-ink bg-coral px-3.5 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-white">
          Nivel oculto
        </span>
      </div>

      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
        Esta zona del mapa no existe
      </h1>
      <p className="mt-3 max-w-md text-muted">
        La ruta que escribiste no lleva a ninguna partida activa. Regresa al inicio o explora el catálogo de juegos y consolas.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/" size="lg">
          <Icon name="arrowLeft" size={18} />
          Volver al inicio
        </ButtonLink>
        <ButtonLink href="/catalogo" variant="secondary" size="lg">
          Ir al catálogo
        </ButtonLink>
      </div>
    </main>
  );
}
