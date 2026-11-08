/** Ilustración de control con stickers flotando alrededor. */
export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden="true">
      <div className="absolute inset-6 rounded-[46%_54%_42%_58%/55%_45%_55%_45%] bg-coral" />
      <div className="absolute inset-14 rounded-[58%_42%_50%_50%/45%_55%_45%_55%] border-2 border-dashed border-[#17142b]/40" />

      <svg viewBox="0 0 240 160" className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 animate-float drop-shadow-[6px_8px_0_#17142b]">
        <path
          d="M60 30h120c22 0 36 14 40 36l12 52c4 20-10 34-26 34-12 0-20-8-28-18l-10-12H72l-10 12c-8 10-16 18-28 18-16 0-30-14-26-34l12-52c4-22 18-36 40-36Z"
          fill="#fffdf8"
          stroke="#17142b"
          strokeWidth="5"
        />
        <rect x="52" y="64" width="12" height="36" rx="4" fill="#17142b" />
        <rect x="40" y="76" width="36" height="12" rx="4" fill="#17142b" />
        <circle cx="178" cy="66" r="9" fill="#c8f169" stroke="#17142b" strokeWidth="4" />
        <circle cx="198" cy="86" r="9" fill="#59c3ff" stroke="#17142b" strokeWidth="4" />
        <circle cx="158" cy="86" r="9" fill="#ffc93c" stroke="#17142b" strokeWidth="4" />
        <circle cx="178" cy="106" r="9" fill="#7b5cff" stroke="#17142b" strokeWidth="4" />
        <rect x="104" y="58" width="32" height="8" rx="4" fill="#17142b" opacity="0.25" />
      </svg>

      <span className="absolute left-0 top-10 rotate-[-10deg] rounded-full border-2 border-ink bg-lime px-4 py-2 font-display text-sm font-bold text-[#17142b] shadow-[3px_3px_0_0_var(--ink)]">
        Juegos
      </span>
      <span className="absolute right-0 top-24 rotate-[8deg] rounded-[1rem_1rem_1rem_0.2rem] border-2 border-ink bg-sky px-4 py-2 font-display text-sm font-bold text-[#17142b] shadow-[3px_3px_0_0_var(--ink)]">
        Consolas
      </span>
      <span className="absolute bottom-12 left-6 rotate-[6deg] rounded-[1rem_1rem_0.2rem_1rem] border-2 border-ink bg-sun px-4 py-2 font-display text-sm font-bold text-[#17142b] shadow-[3px_3px_0_0_var(--ink)]">
        Figuras
      </span>
      <span className="absolute bottom-4 right-10 -rotate-6 rounded-full border-2 border-ink bg-surface px-4 py-2 font-display text-sm font-bold shadow-[3px_3px_0_0_var(--ink)]">
        Accesorios
      </span>
    </div>
  );
}
