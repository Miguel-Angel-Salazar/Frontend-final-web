import type { Product } from "../domain/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id} className="animate-rise" style={{ animationDelay: `${index * 50}ms` }}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
