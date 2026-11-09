import type { Metadata } from "next";
import { RouteGuard } from "@/features/auth/components/RouteGuard";
import { AdminDashboard } from "@/features/products/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Administración",
};

export default function AdminPage() {
  return (
    <RouteGuard requireAdmin>
      <main className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <header className="mb-8 space-y-2">
          <p className="font-semibold text-coral">Centro de control · Solo administradores</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Panel de <span className="squiggle">administración</span>
          </h1>
          <p className="max-w-xl text-sm text-muted">
            Publica juegos, consolas, accesorios y figuras, organiza las categorías y actualiza el estado de los pedidos.
          </p>
        </header>

        <AdminDashboard />
      </main>
    </RouteGuard>
  );
}
