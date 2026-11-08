import { Suspense } from "react";
import type { Metadata } from "next";
import { RouteGuard } from "@/features/auth/components/RouteGuard";
import { LoadingState } from "@/features/common/components/StateMessages";
import { UserOrdersView } from "@/features/orders/components/UserOrdersView";

export const metadata: Metadata = {
  title: "Mis pedidos",
};

export default function OrdersPage() {
  return (
    <RouteGuard>
      <main className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
        <header className="mb-8 space-y-2">
          <p className="font-semibold text-coral">Historial de compras</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Mis <span className="squiggle">pedidos</span>
          </h1>
          <p className="max-w-lg text-sm text-muted">
            Revisa el estado de cada envío o cancela los pedidos que aún estén pendientes de despacho.
          </p>
        </header>

        <Suspense fallback={<LoadingState label="Cargando tus pedidos..." />}>
          <UserOrdersView />
        </Suspense>
      </main>
    </RouteGuard>
  );
}
