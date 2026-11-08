const steps = [
  { title: "Crea tu cuenta", text: "Regístrate en segundos con tu correo. Tu sesión queda guardada." },
  { title: "Elige tu botín", text: "Filtra por plataforma, categoría o precio hasta dar con lo que buscas." },
  { title: "Haz tu pedido", text: "Indica la cantidad, confirma y sigue el estado desde «Mis pedidos»." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
      <h2 className="mb-14 text-center font-display text-4xl font-extrabold sm:text-5xl">Así de fácil</h2>
      <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
        <svg
          className="pointer-events-none absolute left-0 top-8 hidden h-24 w-full text-line md:block"
          viewBox="0 0 900 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M60 30 C 250 110, 350 -30, 450 50 S 700 110, 840 30" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 10" />
        </svg>
        {steps.map((step, index) => (
          <li key={step.title} className={index === 1 ? "relative md:translate-y-10" : "relative"}>
            <div className="flex flex-col items-center text-center">
              <span className="grid size-16 place-items-center rounded-full border-2 border-ink bg-surface font-display text-2xl font-extrabold shadow-[4px_4px_0_0_var(--ink)]">
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
