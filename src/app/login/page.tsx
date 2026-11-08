import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { GuestGuard } from "@/features/auth/components/RouteGuard";
import { LoadingState } from "@/features/common/components/StateMessages";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthShell
        badge="Punto de control"
        title="Iniciar sesión"
        subtitle="Ingresa con tu correo y contraseña para gestionar tus pedidos."
        accentTitle="Tu inventario te está esperando."
        accentCopy="Revisa el estado de tus compras, haz nuevos pedidos o administra el catálogo si eres parte del equipo."
      >
        <Suspense fallback={<LoadingState label="Cargando formulario..." />}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </GuestGuard>
  );
}
