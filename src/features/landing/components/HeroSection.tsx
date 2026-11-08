import { ButtonLink } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";
import { HeroArt } from "./HeroArt";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:px-8 lg:pt-20">
      <div className="dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7 animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-semibold text-muted">
            <span className="size-2 rounded-full bg-coral animate-pulse" />
            Tienda gamer en línea
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Vuelve a la{" "}
            <span className="relative inline-block">
              <span className="relative z-10">partida</span>
              <span className="absolute inset-x-[-6px] bottom-1 top-[45%] -z-0 -rotate-2 rounded-lg bg-lime" />
            </span>
            <br />
            con todo lo que te falta.
          </h1>
          <p className="max-w-lg text-lg text-muted">
            Juegos, consolas, controles y figuras de tus personajes favoritos. Explora el catálogo, haz tu pedido y
            síguelo desde tu cuenta.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/catalogo" size="lg">
              Explorar catálogo
              <Icon name="arrowRight" size={18} />
            </ButtonLink>
            <ButtonLink href="/register" variant="ghost" size="lg">
              Crear cuenta gratis
            </ButtonLink>
          </div>
        </div>
        <HeroArt />
      </div>
    </section>
  );
}
