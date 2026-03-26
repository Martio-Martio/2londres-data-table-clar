import * as XLSX from "xlsx";

/** Plafond de lignes pour un export « liste complète » via l’API (évite des requêtes démesurées). */
export const DATA_TABLE_EXPORT_MAX_ROWS = 50_000;

export function clampExportLimit(totalItems: number): number {
  return Math.min(Math.max(totalItems, 0), DATA_TABLE_EXPORT_MAX_ROWS);
}

/**
 * Télécharge un CSV UTF-8 (BOM) à partir d’un tableau d’objets (souvent des lignes TanStack `original`).
 */
export function downloadCsvFromRows<T extends Record<string, unknown>>(
  rows: T[],
  exportFileName: string,
  fileSuffix: string,
): void {
  if (!rows.length) {
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${exportFileName}${fileSuffix}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
