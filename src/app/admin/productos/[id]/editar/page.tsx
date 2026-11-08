import type { Metadata } from "next";
import { RouteGuard } from "@/features/auth/components/RouteGuard";
import { ProductForm } from "@/features/products/components/ProductForm";

export const metadata: Metadata = {
  title: "Editar producto",
};

export default async function EditProductPage({ params }: PageProps<"/admin/productos/[id]/editar">) {
  const { id } = await params;

  return (
    <RouteGuard requireAdmin>
      <main className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
        <header className="mb-8 space-y-2">
          <p className="font-semibold text-coral">Inventario · Administración</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Editar <span className="squiggle">producto</span>
          </h1>
        </header>

        <ProductForm mode="edit" productId={id} />
      </main>
    </RouteGuard>
  );
}
