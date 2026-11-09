"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import type { FieldErrors } from "@/features/auth/domain/auth";
import { Button, ButtonLink } from "@/features/common/components/Button";
import { SelectField, TextAreaField, TextField } from "@/features/common/components/FormFields";
import { Icon } from "@/features/common/components/Icon";
import { InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import type { EntityId } from "@/features/common/domain/pagination";
import { getErrorMessage } from "@/features/common/http/apiError";
import { PLATFORMS, type Product, type ProductInput } from "../domain/product";
import { useProductActions } from "../hooks/useProducts";
import { ProductImage } from "./ProductImage";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: EntityId;
}

const EMPTY_VALUES: ProductInput = {
  name: "",
  description: "",
  price: "",
  stock: "10",
  platform: "",
  categoryId: "",
};

function toFormValues(product: Product): ProductInput {
  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    platform: product.platform,
    categoryId: String(product.categoryId),
  };
}

function validate(
  values: ProductInput,
  mode: "create" | "edit",
  imageFile: File | null,
  currentImageUrl: string | null,
): FieldErrors<ProductInput> & { image?: string } {
  const errors: FieldErrors<ProductInput> & { image?: string } = {};

  if (values.name.trim().length < 2) {
    errors.name = "Escribe un nombre descriptivo para el producto.";
  }
  if (values.description.trim().length < 10) {
    errors.description = "Agrega una descripción de al menos 10 caracteres.";
  }
  const numericPrice = Number(values.price);
  if (!values.price || Number.isNaN(numericPrice) || numericPrice <= 0) {
    errors.price = "Ingresa un precio válido mayor a cero.";
  }
  const numericStock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
    errors.stock = "Las existencias deben ser un número entero mayor o igual a 0.";
  }
  if (!values.platform) {
    errors.platform = "Selecciona la plataforma.";
  }
  if (!values.categoryId) {
    errors.categoryId = "Selecciona una categoría.";
  }
  if (mode === "create" && !imageFile && !currentImageUrl) {
    errors.image = "Sube un archivo de imagen para el producto.";
  }
  return errors;
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { categories, isLoading: loadingCategories } = useCategories();
  const { getProductById, createProduct, updateProduct } = useProductActions();

  const [values, setValues] = useState<ProductInput>(EMPTY_VALUES);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors<ProductInput> & { image?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(mode === "edit");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;
    let active = true;
    getProductById(productId)
      .then((product) => {
        if (!active) return;
        setValues(toFormValues(product));
        setExistingImageUrl(product.imageUrl);
      })
      .catch((err) => {
        if (active) setServerError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setIsLoadingProduct(false);
      });
    return () => {
      active = false;
    };
  }, [mode, productId, getProductById]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    setErrors((current) => ({ ...current, image: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values, mode, imageFile, existingImageUrl);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSaving(true);
    setServerError(null);
    try {
      if (mode === "create") {
        await createProduct(values, imageFile);
      } else if (productId !== undefined) {
        await updateProduct(productId, values, imageFile);
      }
      router.push("/admin");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProduct || loadingCategories) {
    return <LoadingState label="Preparando formulario del producto..." />;
  }

  const displayedImage = previewUrl ?? existingImageUrl;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink">
          <Icon name="arrowLeft" size={18} />
          Volver al panel de administración
        </Link>
      </div>

      {serverError && <InlineAlert message={serverError} />}

      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Subida de archivo a bucket S3 (Supabase Storage) */}
        <div className="space-y-4 rounded-[2.2rem_0.8rem_2.2rem_2.2rem] border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--ink)]">
          <label
            htmlFor="product-image-file"
            className="block font-display text-lg font-bold"
          >
            Imagen del producto
          </label>
          <p className="text-xs text-muted">
            Sube una imagen en formato JPG, PNG o WebP para mostrarla en el catálogo de la tienda.
          </p>

          <ProductImage
            src={displayedImage}
            alt={values.name || "Vista previa del producto"}
            className="aspect-[4/3] rounded-[1.5rem] border-2 border-dashed border-line"
          />

          <label
            htmlFor="product-image-file"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink bg-lime px-5 py-3 text-sm font-bold text-[#17142b] transition hover:-translate-y-0.5"
          >
            <Icon name="upload" size={18} />
            {imageFile ? "Cambiar archivo seleccionado" : "Seleccionar archivo de imagen"}
          </label>
          <input
            id="product-image-file"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileChange}
            className="sr-only"
          />

          {imageFile && (
            <p className="truncate text-xs font-medium text-muted">
              Archivo: <strong className="text-ink">{imageFile.name}</strong> ({Math.round(imageFile.size / 1024)} KB)
            </p>
          )}
          {errors.image && <p className="text-sm font-medium text-coral">{errors.image}</p>}
        </div>

        {/* Datos del producto */}
        <div className="space-y-5 rounded-[0.8rem_2.2rem_2.2rem_2.2rem] border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--ink)] sm:p-8">
          <TextField
            label="Nombre del producto"
            name="name"
            placeholder="Ej: The Legend of Zelda: Echoes of Wisdom"
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
            error={errors.name}
          />

          <TextAreaField
            label="Descripción"
            name="description"
            placeholder="Describe qué incluye la edición, estado, compatibilidad o detalles del personaje..."
            value={values.description}
            onChange={(event) => setValues({ ...values, description: event.target.value })}
            error={errors.description}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Precio (COP)"
              name="price"
              type="number"
              min={0}
              step={1000}
              placeholder="249900"
              value={values.price}
              onChange={(event) => setValues({ ...values, price: event.target.value })}
              error={errors.price}
            />

            <TextField
              label="Unidades en stock"
              name="stock"
              type="number"
              min={0}
              step={1}
              placeholder="15"
              value={values.stock}
              onChange={(event) => setValues({ ...values, stock: event.target.value })}
              error={errors.stock}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Plataforma"
              name="platform"
              placeholder="Selecciona una plataforma"
              options={PLATFORMS.map((item) => ({ value: item.value, label: item.label }))}
              value={values.platform}
              onChange={(event) =>
                setValues({ ...values, platform: event.target.value as ProductInput["platform"] })
              }
              error={errors.platform}
            />

            <SelectField
              label="Categoría"
              name="categoryId"
              placeholder="Selecciona una categoría"
              options={categories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
              value={values.categoryId}
              onChange={(event) => setValues({ ...values, categoryId: event.target.value })}
              error={errors.categoryId}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t-2 border-dashed border-line pt-5">
            <ButtonLink href="/admin" variant="ghost">
              Cancelar
            </ButtonLink>
            <Button type="submit" isLoading={isSaving}>
              {mode === "create" ? "Publicar producto" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
