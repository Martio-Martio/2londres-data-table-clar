/**
 * Segments pour afficher une pagination compacte (pages + ellipses).
 * `currentPage` et les pages retournées sont en base 1.
 */
export type PaginationSegment =
  | { kind: "page"; page: number }
  | { kind: "ellipsis"; key: string };

export type GetVisiblePaginationSegmentsOptions = {
  /** Pages de chaque côté de la page courante (défaut : 1). */
  siblingCount?: number;
};

/**
 * Construit la liste des segments (numéros + ellipses) sans dupliquer les pages.
 */
export function getVisiblePaginationSegments(
  currentPage: number,
  totalPages: number,
  options?: GetVisiblePaginationSegmentsOptions,
): PaginationSegment[] {
  if (totalPages <= 0) {
    return [];
  }

  const siblingCount = options?.siblingCount ?? 1;
  const current = Math.min(Math.max(1, currentPage), totalPages);

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      kind: "page" as const,
      page: i + 1,
    }));
  }

  const left = current - siblingCount;
  const right = current + siblingCount + 1;
  const range: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  const out: PaginationSegment[] = [];
  let last: number | undefined;

  for (const i of range) {
    if (last !== undefined) {
      if (i - last === 2) {
        out.push({ kind: "page", page: last + 1 });
      } else if (i - last > 2) {
        out.push({ kind: "ellipsis", key: `gap-${last}-${i}` });
      }
    }
    out.push({ kind: "page", page: i });
    last = i;
  }

  return out;
}
