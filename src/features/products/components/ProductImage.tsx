import Image from "next/image";
import { Icon } from "@/features/common/components/Icon";
import { cn } from "@/features/common/utils/format";

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Imagen del producto (URL de Supabase Storage) con un respaldo si no tiene. */
export function ProductImage({ src, alt, className, sizes = "(max-width: 768px) 100vw, 33vw", priority }: ProductImageProps) {
  if (!src) {
    return (
      <div className={cn("grid place-items-center bg-surface-soft text-muted", className)}>
        <Icon name="gamepad" size={44} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized className="object-cover" />
    </div>
  );
}
