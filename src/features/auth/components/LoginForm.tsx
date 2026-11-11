"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/features/common/components/Button";
import { TextField } from "@/features/common/components/FormFields";
import { InlineAlert } from "@/features/common/components/StateMessages";
import { getErrorMessage } from "@/features/common/http/apiError";
import type { FieldErrors, LoginRequest } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

function validate(values: LoginRequest): FieldErrors<LoginRequest> {
  const errors: FieldErrors<LoginRequest> = {};
  if (!values.email.trim()) {
    errors.email = "Escribe tu correo electrónico.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "El formato del correo no es válido.";
  }
  if (!values.password) {
    errors.password = "Escribe tu contraseña.";
  }
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [values, setValues] = useState<LoginRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginRequest>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expiredNotice = searchParams.get("expired") === "1";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      await login(values);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/");
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {expiredNotice && !serverError && (
        <InlineAlert message="Tu sesión expiró. Inicia sesión de nuevo para continuar." />
      )}
      {serverError && <InlineAlert message={serverError} onDismiss={() => setServerError(null)} />}

      <TextField
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="jugador@respawn.com"
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
        error={errors.email}
      />

      <TextField
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
        error={errors.password}
      />

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Entrar a mi cuenta
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/register" className="font-bold text-ink underline decoration-coral decoration-2 underline-offset-4">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
