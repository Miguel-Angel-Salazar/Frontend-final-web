import { ButtonLink } from "@/features/common/components/Button";
import { Icon } from "@/features/common/components/Icon";

export function RolesSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-32 sm:px-8">
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[2.5rem_0.8rem_2.5rem_2.5rem] bg-violet p-8 text-white sm:p-10">
          <Icon name="user" size={32} />
          <h3 className="mt-6 font-display text-3xl font-bold">Para jugadores</h3>
          <p className="mt-3 text-white/85">
            Navega el catálogo sin cuenta. Cuando te registras puedes hacer pedidos, revisar su estado y cancelarlos si
            cambias de opinión.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-8 rounded-[0.8rem_2.5rem_2.5rem_2.5rem] border-2 border-ink bg-surface p-8 sm:p-10">
          <div>
            <Icon name="shield" size={32} className="text-coral" />
            <h3 className="mt-6 font-display text-3xl font-bold">Para el equipo de la tienda</h3>
            <p className="mt-3 text-muted">
              Los administradores gestionan el inventario: crean productos con foto, actualizan precios y existencias,
              organizan las categorías y despachan los pedidos de todos los clientes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register">Empezar ahora</ButtonLink>
            <ButtonLink href="/login" variant="ghost">
              Ya tengo cuenta
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
