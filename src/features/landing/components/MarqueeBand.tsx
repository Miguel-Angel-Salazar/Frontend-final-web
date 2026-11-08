const words = ["Juegos", "Consolas", "Controles", "Audífonos", "Figuras", "Personajes", "Coleccionables"];

/** Cinta inclinada con texto en movimiento. */
export function MarqueeBand() {
  return (
    <div className="relative z-10 -mx-4 -rotate-2 overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-8 pr-8" aria-hidden={copy === 1}>
            {words.map((word) => (
              <span key={word} className="flex items-center gap-8 font-display text-2xl font-bold">
                {word}
                <span className="text-lime">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
