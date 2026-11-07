import type { Pagination } from "../domain/pagination";
import { cn } from "../utils/format";
import { Icon } from "./Icon";

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

function visiblePages(current: number, total: number): number[] {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { currentPage, totalPages, total } = pagination;
  if (totalPages <= 1) return null;

  const arrowClasses =
    "grid size-10 place-items-center rounded-full border-2 border-line transition hover:border-ink disabled:opacity-40 disabled:hover:border-line";

  return (
    <nav aria-label="Paginación" className="flex flex-col items-center gap-3 pt-10">
      <div className="flex items-center gap-2 rounded-full bg-surface p-1.5 shadow-sm">
        <button
          type="button"
          className={arrowClasses}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
        >
          <Icon name="arrowLeft" size={18} />
        </button>
        {visiblePages(currentPage, totalPages).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "size-10 rounded-full text-sm font-bold transition",
              page === currentPage ? "bg-ink text-paper scale-110" : "hover:bg-surface-soft",
            )}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className={arrowClasses}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
        >
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
      <p className="text-xs text-muted">{total} resultados en total</p>
    </nav>
  );
}
