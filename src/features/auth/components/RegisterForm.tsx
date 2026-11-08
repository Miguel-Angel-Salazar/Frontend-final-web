"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/features/common/components/Button";
import { TextField } from "@/features/common/components/FormFields";
import { InlineAlert } from "@/features/common/components/StateMessages";
import { getErrorMessage } from "@/features/common/http/apiError";
import type { FieldErrors, RegisterRequest } from "../domain/auth";
import { useAuth } from "../hooks/useAuth";

function validate(values: RegisterRequest): FieldErrors<RegisterRequest> {
  const errors: FieldErrors<RegisterRequest> = {};
  if (values.name.trim().length < 2) {
    errors.name = "Escribe tu nombre (mínimo 2 letras).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  }
  if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [values, setValues] = useState<RegisterRequest>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<RegisterRequest>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      await register(values);
      router.push("/catalogo");
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && <InlineAlert message={serverError} />}

      <TextField
        label="Tu nombre o alias"
        name="name"
        autoComplete="name"
        placeholder="Camila Gómez"
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
        error={errors.name}
      />

      <TextField
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="camila@respawn.com"
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
        error={errors.email}
      />

      <TextField
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        hint="Tu sesión se inicia automáticamente al registrarte."
        value={values.password}
        onChange={(event) => setValues({ ...values, password: event.target.value })}
        error={errors.password}
      />

      <Button type="submit" variant="secondary" size="lg" className="w-full" isLoading={isSubmitting}>
        Crear cuenta y entrar
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-bold text-ink underline decoration-violet decoration-2 underline-offset-4">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
