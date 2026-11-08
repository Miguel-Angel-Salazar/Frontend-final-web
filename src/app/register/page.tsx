import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { GuestGuard } from "@/features/auth/components/RouteGuard";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthShell
        badge="Nuevo jugador"
        title="Crear cuenta"
        subtitle="Completa tus datos y empieza a armar tu colección."
        accentTitle="Únete a la partida en menos de un minuto."
        accentCopy="Con tu cuenta puedes pedir juegos, consolas, controles y figuras coleccionables con seguimiento en línea."
      >
        <RegisterForm />
      </AuthShell>
    </GuestGuard>
  );
}
