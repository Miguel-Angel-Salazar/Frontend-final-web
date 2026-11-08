import type { Metadata } from "next";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";

export const metadata: Metadata = {
  title: "Detalle del producto",
};

export default async function ProductDetailPage({ params }: PageProps<"/catalogo/[id]">) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
      <ProductDetailView id={id} />
    </main>
  );
}
