"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/features/common/components/Button";
import { ConfirmDialog } from "@/features/common/components/ConfirmDialog";
import { TextAreaField, TextField } from "@/features/common/components/FormFields";
import { Icon } from "@/features/common/components/Icon";
import { EmptyState, ErrorState, InlineAlert, LoadingState } from "@/features/common/components/StateMessages";
import { getErrorMessage } from "@/features/common/http/apiError";
import type { Category, CategoryInput } from "../domain/category";
import { useCategories } from "../hooks/useCategories";
import { categoryService } from "../services/categoryService";

const EMPTY_CATEGORY: CategoryInput = { name: "", description: "" };

export function CategoryManager() {
  const { categories, isLoading, error, reload } = useCategories();

  const [editing, setEditing] = useState<Category | null>(null);
  const [values, setValues] = useState<CategoryInput>(EMPTY_CATEGORY);
  const [nameError, setNameError] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (category: Category) => {
    setEditing(category);
    setValues({ name: category.name, description: category.description ?? "" });
    setNameError(undefined);
    setServerError(null);
  };

  const resetForm = () => {
    setEditing(null);
    setValues(EMPTY_CATEGORY);
    setNameError(undefined);
    setServerError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (values.name.trim().length < 2) {
      setNameError("Escribe un nombre de categoría válido.");
      return;
    }

    setIsSaving(true);
    setNameError(undefined);
    setServerError(null);
    try {
      const payload = { name: values.name.trim(), description: values.description.trim() };
      if (editing) {
        await categoryService.update(editing.id, payload);
      } else {
        await categoryService.create(payload);
      }
      resetForm();
      reload();
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setServerError(null);
    try {
      await categoryService.remove(deleteTarget.id);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-[2rem_0.7rem_2rem_2rem] border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--ink)]"
      >
        <h2 className="font-display text-xl font-bold">
          {editing ? `Editar «${editing.name}»` : "Nueva categoría"}
        </h2>
        {serverError && <InlineAlert message={serverError} />}

        <TextField
          label="Nombre"
          name="name"
          placeholder="Ej: Consolas, Accesorios, Figuras..."
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          error={nameError}
        />

        <TextAreaField
          label="Descripción"
          name="description"
          placeholder="Breve explicación de los artículos que agrupa esta categoría..."
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />

        <div className="flex flex-wrap justify-end gap-2.5 pt-2">
          {editing && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancelar edición
            </Button>
          )}
          <Button type="submit" size="sm" isLoading={isSaving}>
            <Icon name={editing ? "edit" : "plus"} size={16} />
            {editing ? "Guardar categoría" : "Crear categoría"}
          </Button>
        </div>
      </form>

      <div>
        {isLoading ? (
          <LoadingState label="Cargando categorías..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : categories.length === 0 ? (
          <EmptyState
            title="Aún no hay categorías"
            description="Crea la primera categoría desde el formulario para clasificar tus productos."
          />
        ) : (
          <ul className="grid gap-3.5">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem_1.6rem_1.6rem_0.5rem] border-2 border-ink bg-surface p-5"
              >
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold">{category.name}</h3>
                  {category.description && <p className="text-sm text-muted">{category.description}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(category)}>
                    <Icon name="edit" size={16} />
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(category)}>
                    <Icon name="trash" size={16} />
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar esta categoría?"
        confirmLabel="Sí, eliminar"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <p>
          Se desactivará la categoría <strong>{deleteTarget?.name}</strong> (borrado lógico).
        </p>
      </ConfirmDialog>
    </div>
  );
}
