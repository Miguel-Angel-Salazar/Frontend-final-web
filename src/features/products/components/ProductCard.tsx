import Link from "next/link";
import { cn, formatPrice } from "@/features/common/utils/format";
import { platformLabel, type Product } from "../domain/product";
import { ProductImage } from "./ProductImage";

const platformTint: Record<string, string> = {
  PS5: "bg-sky/30",
  XBOX: "bg-lime/40",
  SWITCH: "bg-coral/20",
  PC: "bg-violet/20",
  MULTI: "bg-sun/35",
};

function StockNote({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-coral">Agotado</span>;
  if (stock <= 3) return <span className="text-coral">¡Últimas {stock} unidades!</span>;
  return <span>{stock} disponibles</span>;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/catalogo/${product.id}`}
      className="group flex h-full flex-col rounded-[2rem_2rem_2rem_0.6rem] bg-surface p-3 transition duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:shadow-[6px_8px_0_0_var(--ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/40"
    >
      <div className={cn("relative rounded-[1.6rem] p-3", platformTint[product.platform] ?? "bg-surface-soft")}>
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-[4/3] rounded-[1.2rem] transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute -bottom-3 right-5 rotate-3 rounded-full border-2 border-ink bg-sun px-3.5 py-1 font-display text-sm font-extrabold text-[#17142b] transition group-hover:rotate-[-4deg]">
          {formatPrice(product.price)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2 pb-2 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <span className="rounded-full bg-surface-soft px-2.5 py-1">{platformLabel(product.platform)}</span>
          {product.category && <span>· {product.category.name}</span>}
        </div>
        <h3 className="font-display text-lg font-bold leading-tight group-hover:text-coral">{product.name}</h3>
        <p className="mt-auto text-xs font-medium text-muted">
          <StockNote stock={product.stock} />
        </p>
      </div>
    </Link>
  );
}
