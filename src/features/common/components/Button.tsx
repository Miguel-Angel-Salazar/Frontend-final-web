import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "../utils/format";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface StyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "btn-arcade bg-coral text-white border-2 border-ink",
  secondary: "btn-arcade bg-lime text-[#17142b] border-2 border-ink",
  ghost: "border-2 border-line text-ink hover:border-ink hover:bg-surface-soft transition-colors",
  danger: "btn-arcade bg-surface text-coral border-2 border-coral [--ink:var(--coral)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-[15px] gap-2",
  lg: "h-14 px-8 text-base gap-2.5",
};

export function buttonClasses({ variant = "primary", size = "md", className }: StyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/40",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleOptions {
  isLoading?: boolean;
}

export function Button({ variant, size, className, isLoading = false, disabled, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
