import type { FilterFn } from "@tanstack/react-table";

export const dateRangeFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue,
) => {
  const rowValue = row.getValue(columnId);
  const { from, to } = (filterValue as { from?: string; to?: string }) || {};

  if (!from && !to) return true;
  if (!rowValue) return false;

  let rowDate: string | undefined;

  if (rowValue instanceof Date) {
    rowDate = rowValue.toISOString().split("T")[0];
  } else if (typeof rowValue === "string") {
    const parsedDate = new Date(rowValue);
    if (!isNaN(parsedDate.getTime())) {
      rowDate = parsedDate.toISOString().split("T")[0];
    } else {
      return false;
    }
  } else {
    return false;
  }

  const fromDate = from ? new Date(from).toISOString().split("T")[0] : null;
  const toDate = to ? new Date(to).toISOString().split("T")[0] : null;

  if (fromDate && toDate) {
    return rowDate >= fromDate && rowDate <= toDate;
  }
  if (fromDate) {
    return rowDate >= fromDate;
  }
  if (toDate) {
    return rowDate <= toDate;
  }

  return true;
};
