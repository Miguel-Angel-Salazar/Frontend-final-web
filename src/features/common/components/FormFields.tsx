"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils/format";

const controlClasses =
  "w-full rounded-2xl border-2 bg-surface px-4 text-ink placeholder:text-muted/70 transition " +
  "focus:outline-none focus:border-violet focus:ring-4 focus:ring-violet/15 disabled:opacity-60";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="pl-1 text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="pl-1 text-sm font-medium text-coral">
          {error}
        </p>
      ) : (
        hint && <p className="pl-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

type TextFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClasses, "h-12", error ? "border-coral" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, error, hint, className, ...props }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClasses, "min-h-28 py-3 resize-y", error ? "border-coral" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[]; placeholder?: string };

export function SelectField({ label, error, hint, options, placeholder, className, ...props }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClasses, "h-12 cursor-pointer", error ? "border-coral" : "border-line", className)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
