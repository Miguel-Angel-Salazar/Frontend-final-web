import Link from "next/link";
import { Icon, type IconName } from "@/features/common/components/Icon";
import { cn } from "@/features/common/utils/format";

interface Showcase {
  title: string;
  text: string;
  icon: IconName;
  className: string;
}

const showcases: Showcase[] = [
  {
    title: "Videojuegos",
    text: "Lanzamientos y clásicos para todas las plataformas, en físico y listos para tu colección.",
    icon: "gamepad",
    className: "bg-coral text-white sm:col-span-2 sm:row-span-2 rounded-[2.5rem_2.5rem_2.5rem_0.8rem] min-h-72",
  },
  {
    title: "Consolas",
    text: "PlayStation, Xbox, Switch y equipos para PC.",
    icon: "box",
    className: "bg-sky text-[#17142b] rounded-[0.8rem_2.5rem_2.5rem_2.5rem] rotate-1",
  },
  {
    title: "Accesorios",
    text: "Controles, audífonos, bases de carga y más.",
    icon: "sparkle",
    className: "bg-lime text-[#17142b] rounded-[2.5rem_0.8rem_2.5rem_2.5rem] -rotate-1",
  },
  {
    title: "Personajes y figuras",
    text: "Figuras, peluches y coleccionables de tus héroes y villanos favoritos.",
    icon: "user",
    className: "bg-surface text-ink sm:col-span-2 lg:col-span-1 rounded-[2.5rem_2.5rem_0.8rem_2.5rem] border-2 border-dashed border-line",
  },
];

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Todo tu <span className="squiggle">setup</span> en un solo lugar
        </h2>
        <Link href="/catalogo" className="group inline-flex items-center gap-2 font-semibold hover:text-coral">
          Ver todo el catálogo
          <Icon name="arrowRight" size={18} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {showcases.map((item) => (
          <article
            key={item.title}
            className={cn("flex flex-col justify-between gap-6 p-7 transition hover:scale-[1.02]", item.className)}
          >
            <span className="grid size-12 place-items-center rounded-full bg-[#17142b]/10">
              <Icon name={item.icon} size={24} />
            </span>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold">{item.title}</h3>
              <p className="text-sm opacity-80">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
