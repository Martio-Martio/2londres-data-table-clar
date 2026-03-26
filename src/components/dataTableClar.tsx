"use client";

import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  HeaderGroup,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Cookies from "js-cookie";
import { Download, X } from "lucide-react";
import type { ReactNode } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { downloadCsvFromRows } from "../lib/dataTableCsvDownload";
import { cn } from "../lib/cn";
import { Button } from "../ui/button";
import { ButtonSpinner } from "../ui/button-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { SearchableSelect } from "../ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DataTableCsvExportDialog,
  type DataTableCsvExportScope,
} from "./DataTableCsvExportDialog";
import { DataTablePaginationBar } from "./DataTablePaginationBar";
import {
  DefaultEmptyTableRow,
  DefaultErrorTableRow,
  DefaultLoadingTable,
} from "./DefaultTableStates";

export type DataTableColumnMetaType = {
  type:
    | "date_from"
    | "date_end"
    | "date"
    | "select"
    | "text"
    | "denied"
    | "selection";
  options?: { value: string; label: string }[];
  headerAlign?: "left" | "center" | "right";
  cellAlign?: "left" | "center" | "right";
};

export interface DataTableRowBase {
  id: string;
}

export interface DataTableClarProps<TData extends DataTableRowBase = DataTableRowBase> {
  data: TData[];
  exportFileName: string;
  title: string;
  error?: {
    message: string;
    refetch?: () => void;
  };
  loading?: {
    isLoading: boolean;
    loaderComponent?: ReactNode;
    isFetching?: boolean;
  };
  itemPerPage?: number;
  columnsClar: (navigate: NavigateFunction) => ColumnDef<TData, unknown>[];
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  paginationMode?: "client" | "server";
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  serverPageCount?: number;
  totalItemsCount?: number;
  onExportFullList?: () => Promise<TData[]>;
  /** Affiche le bouton d’export CSV (remplace la logique Redux/admin côté app). Défaut : false. */
  showCsvExportButton?: boolean;
  /** Mode client : affiche le sélecteur de volume + cookie (désactiver si vous injectez `renderVolumeControl`). Défaut : true hors mode server. */
  enableClientVolumeControl?: boolean;
  /** Remplace le sélecteur de volume intégré (SearchableSelect + cookie). */
  renderVolumeControl?: ReactNode;
  onNotifyWarning?: (messageKey: string) => void;
  onNotifyError?: (message: string, durationMs?: number) => void;
  onNotifyInfo?: (message: string) => void;
  renderLoading?: (ctx: { numberOfColumns: number }) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderError?: (error: {
    message: string;
    refetch?: () => void;
  }) => ReactNode;
  renderCsvExportLoading?: () => ReactNode;
}

const numbersVolum = [
  { label: "05", value: "5" },
  { label: "10", value: "10" },
  { label: "100", value: "100" },
  { label: "200", value: "200" },
  { label: "300", value: "300" },
  { label: "400", value: "400" },
  { label: "500", value: "500" },
  { label: "1000", value: "1000" },
  { label: "2000", value: "2000" },
  { label: "3000", value: "3000" },
  { label: "4000", value: "4000" },
  { label: "5000", value: "5000" },
  { label: "10000", value: "10000" },
  { label: "15000", value: "15000" },
  { label: "20000", value: "20000" },
];

export function DataTableClar<TData extends DataTableRowBase = DataTableRowBase>({
  data,
  exportFileName,
  title,
  error,
  loading,
  itemPerPage,
  columnsClar,
  enableSelection = false,
  onSelectionChange,
  paginationMode: paginationModeProp,
  pagination: paginationProp,
  onPaginationChange: onPaginationChangeProp,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange: onColumnFiltersChangeProp,
  serverPageCount,
  totalItemsCount,
  onExportFullList,
  showCsvExportButton = false,
  enableClientVolumeControl,
  renderVolumeControl,
  onNotifyWarning,
  onNotifyError,
  onNotifyInfo,
  renderLoading,
  renderEmpty,
  renderError,
  renderCsvExportLoading,
}: DataTableClarProps<TData>) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: itemPerPage ? itemPerPage : 6,
    });

  const paginationMode = paginationModeProp ?? "client";
  const isServer = paginationMode === "server";
  const showVolumeBuiltIn =
    !isServer &&
    (enableClientVolumeControl ?? true) &&
    renderVolumeControl === undefined;

  const columnFilters = columnFiltersProp ?? internalColumnFilters;
  const setColumnFilters: OnChangeFn<ColumnFiltersState> =
    onColumnFiltersChangeProp ?? setInternalColumnFilters;

  const pagination = paginationProp ?? internalPagination;
  const setPagination: OnChangeFn<PaginationState> =
    onPaginationChangeProp ?? setInternalPagination;

  const defineVolumGet = Cookies.get("defineVolum") as string | undefined;
  const [defineVolum, setDefineVolum] = useState<string>(
    defineVolumGet !== undefined ? defineVolumGet : "100",
  );

  const [csvExportDialogOpen, setCsvExportDialogOpen] = useState(false);
  const [csvExportDialogKey, setCsvExportDialogKey] = useState(0);
  const [csvExportLoading, setCsvExportLoading] = useState(false);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { pageIndex, pageSize } = pagination;

  const goToPage = (page: number) => {
    setPagination({ pageIndex: page - 1, pageSize });
  };

  const clientPageCount = useMemo(
    () => Math.max(1, Math.ceil((data?.length ?? 0) / pageSize) || 1),
    [data?.length, pageSize],
  );

  const resolvedPageCount = isServer
    ? Math.max(0, serverPageCount ?? 0)
    : clientPageCount;

  useEffect(() => {
    if (
      isServer &&
      paginationProp !== undefined &&
      onPaginationChangeProp !== undefined &&
      columnFiltersProp === undefined &&
      onColumnFiltersChangeProp === undefined
    ) {
      console.warn(
        "[DataTableClar] Mode server : branchez columnFilters et onColumnFiltersChange pour appliquer les filtres côté API (React Query).",
      );
    }
  }, [
    isServer,
    paginationProp,
    onPaginationChangeProp,
    columnFiltersProp,
    onColumnFiltersChangeProp,
  ]);

  const columnsWithSelection = useMemo(() => {
    if (!enableSelection) return columnsClar(navigate);

    const SelectionHeader: React.FC<{
      getIsAllRowsSelected: () => boolean;
      getIsSomeRowsSelected: () => boolean;
      getToggleAllRowsSelectedHandler: () => (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => void;
    }> = ({
      getIsAllRowsSelected,
      getIsSomeRowsSelected,
      getToggleAllRowsSelectedHandler,
    }) => {
      const ref = useRef<HTMLInputElement>(null);
      const isSomeRowsSelected = getIsSomeRowsSelected();
      const isAllRowsSelected = getIsAllRowsSelected();
      useEffect(() => {
        if (ref.current) {
          ref.current.indeterminate = isSomeRowsSelected && !isAllRowsSelected;
        }
      }, [isSomeRowsSelected, isAllRowsSelected]);
      return (
        <div className="flex items-center space-x-2">
          <input
            id="select-all"
            ref={ref}
            type="checkbox"
            checked={isAllRowsSelected}
            onChange={getToggleAllRowsSelectedHandler()}
            className="w-6 h-6 accent-primary"
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("selectAll")}
          </label>
        </div>
      );
    };

    return [
      {
        id: "selection",
        header: (ctx: { table: ReturnType<typeof useReactTable<TData>> }) => (
          <SelectionHeader
            getIsAllRowsSelected={ctx.table.getIsAllRowsSelected}
            getIsSomeRowsSelected={ctx.table.getIsSomeRowsSelected}
            getToggleAllRowsSelectedHandler={
              ctx.table.getToggleAllRowsSelectedHandler
            }
          />
        ),
        cell: ({ row }: { row: Row<TData> }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 accent-primary"
            aria-label={t("dataTableSelectRowAria")}
          />
        ),
        size: 40,
        meta: { type: "selection" } satisfies DataTableColumnMetaType,
      },
      ...columnsClar(navigate),
    ];
  }, [enableSelection, columnsClar, navigate, t]);

  const table = useReactTable<TData>({
    data: data,
    columns: columnsWithSelection,
    getRowId: (row) => row.id,
    defaultColumn: {
      size: 150,
      minSize: 48,
      maxSize: 800,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(isServer
      ? {
          manualPagination: true,
          manualFiltering: true,
          pageCount: resolvedPageCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
        }),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    initialState: {
      pagination: {
        pageSize: itemPerPage ? itemPerPage : 4,
      },
    },
    enableRowSelection: enableSelection,
  });

  useEffect(() => {
    if (enableSelection && onSelectionChange) {
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);
      onSelectionChange(selectedIds);
    }
  }, [rowSelection, enableSelection, onSelectionChange, table]);

  const handleCsvExportConfirm = async (scope: DataTableCsvExportScope) => {
    const showLoad =
      scope === "fullList" && isServer && onExportFullList !== undefined;
    try {
      if (showLoad) {
        setCsvExportLoading(true);
      }
      if (scope === "currentPage") {
        const rows = table.getRowModel().rows.map((row) => row.original);
        if (!rows.length) {
          onNotifyWarning?.("noDataToExport");
          return;
        }
        const fileSuffix = `_page_${pagination.pageIndex + 1}`;
        downloadCsvFromRows(
          rows as Record<string, unknown>[],
          exportFileName,
          fileSuffix,
        );
        setCsvExportDialogOpen(false);
      } else if (isServer) {
        if (!onExportFullList) {
          return;
        }
        const rows = await onExportFullList();
        if (!rows.length) {
          onNotifyWarning?.("noDataToExport");
          return;
        }
        downloadCsvFromRows(
          rows as Record<string, unknown>[],
          exportFileName,
          "_complete",
        );
        setCsvExportDialogOpen(false);
      } else {
        const rows = table
          .getPrePaginationRowModel()
          .rows.map((row) => row.original);
        if (!rows.length) {
          onNotifyWarning?.("noDataToExport");
          return;
        }
        downloadCsvFromRows(
          rows as Record<string, unknown>[],
          exportFileName,
          "_complete",
        );
        setCsvExportDialogOpen(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("loadErrorDescription");
      onNotifyError?.(msg, 8000);
    } finally {
      if (showLoad) {
        setCsvExportLoading(false);
      }
    }
  };

  const resetFilters = () => {
    if (isServer) {
      setColumnFilters([]);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      if (enableSelection) {
        table.resetRowSelection();
      }
      return;
    }
    table.resetColumnFilters();
    setColumnFilters([]);
    setDefineVolum("100");
  };

  const renderFilter = (column: Column<TData, unknown>) => {
    const columnMeta = column.columnDef.meta as DataTableColumnMetaType;

    switch (columnMeta?.type) {
      case "date_from": {
        const filterValue =
          (column.getFilterValue() as { from?: string; to?: string }) || {};
        return (
          <Input
            type="date"
            placeholder={t("dataTableFilterDateStart")}
            value={filterValue.from ?? ""}
            onChange={(event) => {
              const newFilter = { ...filterValue, from: event.target.value };
              column.setFilterValue(newFilter);
            }}
            className="max-w-sm"
          />
        );
      }
      case "date_end": {
        const filterValue =
          (column.getFilterValue() as { from?: string; to?: string }) || {};
        return (
          <Input
            type="date"
            placeholder={t("dataTableFilterDateEnd")}
            value={filterValue.to ?? ""}
            onChange={(event) => {
              const newFilter = { ...filterValue, to: event.target.value };
              column.setFilterValue(newFilter);
            }}
            className="max-w-sm"
          />
        );
      }
      case "date": {
        return (
          <Input
            type="date"
            placeholder={t("dataTableFilterByDate")}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              column.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        );
      }
      case "select": {
        const options = columnMeta.options || [];
        return (
          <Select
            onValueChange={(value) => {
              if (value === "Tout") {
                column.setFilterValue("");
              } else {
                column.setFilterValue(value);
              }
            }}
            value={(column.getFilterValue() as string) ?? "Tout"}
          >
            <SelectTrigger className="w-[180px] bg-white border-2 border-border hover:border-primary focus:border-primary shadow-sm">
              <SelectValue placeholder={t("dataTableSelectPlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-border shadow-lg">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "text": {
        return (
          <Input
            placeholder={t("dataTableFilterByColumn", {
              column:
                (column.columnDef.header as string | undefined) ?? column.id,
            })}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        );
      }
      case "denied": {
        return null;
      }
      default:
        return null;
    }
  };

  const numberOfColumns = table?.getAllFlatColumns().length || 5;
  const numberOfRows = table?.getRowModel().rows.length;
  const showSkeletonInsteadOfRows =
    Boolean(loading?.isLoading) ||
    (loading?.isFetching === true && data.length === 0);
  const showEmptyTable =
    !loading?.isFetching &&
    !error?.message &&
    (isServer ? (totalItemsCount ?? 0) === 0 : !numberOfRows);

  const columnLayoutTotal =
    table
      .getVisibleLeafColumns()
      .reduce((sum, col) => sum + col.getSize(), 0) || 1;

  const loadingFallback =
    renderLoading?.({ numberOfColumns }) ?? (
      <DefaultLoadingTable numberOfColumns={numberOfColumns} />
    );
  const emptyFallback = renderEmpty?.() ?? <DefaultEmptyTableRow />;
  const errorFallback =
    renderError?.(error ?? { message: "" }) ?? (
      <DefaultErrorTableRow error={error} />
    );

  return (
    <Card className="mt-1 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex flex-wrap gap-4 items-center py-2">
            <div className="flex flex-row space-x-2">
              {table.getAllColumns().map((column) => {
                if (column.id === "selection") return null;
                const columnMeta = column.columnDef.meta as DataTableColumnMetaType;
                if (columnMeta?.type === "denied") return null;
                return (
                  <div key={column.id} className="flex flex-col">
                    <label
                      htmlFor={column.id}
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      {column.columnDef.header as string}
                    </label>
                    {renderFilter(column)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-0 justify-end items-end py-1">
            {renderVolumeControl}
            {showVolumeBuiltIn ? (
              <div className="w-[200px]">
                <label className="text-xs font-semibold text-muted-foreground">
                  {t("dataTableVolumeLabel")}
                </label>
                <SearchableSelect
                  options={numbersVolum}
                  value={defineVolum}
                  onValueChange={(value) => {
                    if (value) {
                      setDefineVolum(value);
                      Cookies.set("defineVolum", value);
                      onNotifyInfo?.(
                        t("dataTableVolumeReloadNotice", { value }),
                      );
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }
                  }}
                  placeholder={t("dataTableVolumeLabel")}
                  searchPlaceholder={t("search")}
                  emptyMessage={t("dataTableNoSelectOptions")}
                  buttonClassName="bg-white border-2 border-border hover:border-primary focus:border-primary shadow-sm font-medium"
                  popoverClassName="bg-white border-2 border-border shadow-lg"
                />
              </div>
            ) : null}

            {showCsvExportButton ? (
              <Button
                type="button"
                onClick={() => {
                  setCsvExportDialogKey((k) => k + 1);
                  setCsvExportDialogOpen(true);
                }}
                className="ml-2"
              >
                <Download className="mr-2 w-4 h-4" />
                {t("dataTableCsvExportOpenButton")}
              </Button>
            ) : null}

            <Button
              onClick={resetFilters}
              variant="destructive"
              className="ml-2"
            >
              <X className="mr-2 w-4 h-4" />
              {t("dataTableResetFilters")}
            </Button>
          </div>
          <div className="flex gap-0 justify-end items-end py-1">
            {data ? (
              <p className="text-xs font-medium text-muted-foreground">
                {isServer
                  ? t("dataTableElementsCount", {
                      current: data.length,
                      total: totalItemsCount ?? 0,
                    })
                  : t("dataTableClientElementsCount", {
                      current: data.length,
                      volume: defineVolum || "",
                    })}
              </p>
            ) : (
              ""
            )}
          </div>

          <div className="rounded-md border">
            <Table className="table-fixed">
              <TableHeader>
                {table
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<TData>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const meta = header.column.columnDef.meta as
                          | DataTableColumnMetaType
                          | undefined;
                        const headerAlign: "left" | "center" | "right" =
                          header.column.id === "selection"
                            ? "center"
                            : (meta?.headerAlign ?? "left");
                        const widthPercent =
                          (header.getSize() / columnLayoutTotal) * 100;
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{ width: `${widthPercent}%` }}
                            className={cn(
                              headerAlign === "left" && "text-left",
                              headerAlign === "center" && "text-center",
                              headerAlign === "right" && "text-right",
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                {showSkeletonInsteadOfRows ? (
                  <>{loading?.loaderComponent ?? loadingFallback}</>
                ) : error?.message ? (
                  errorFallback
                ) : showEmptyTable ? (
                  emptyFallback
                ) : (
                  <>
                    {table.getRowModel().rows.map((row: Row<TData>) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as
                            | DataTableColumnMetaType
                            | undefined;
                          const cellAlign: "left" | "center" | "right" =
                            cell.column.id === "selection"
                              ? "center"
                              : (meta?.cellAlign ?? "left");
                          const widthPercent =
                            (cell.column.getSize() / columnLayoutTotal) * 100;
                          return (
                            <TableCell
                              key={cell.id}
                              style={{ width: `${widthPercent}%` }}
                              className={cn(
                                cellAlign === "left" && "text-left",
                                cellAlign === "center" && "text-center",
                                cellAlign === "right" && "text-right",
                              )}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePaginationBar
            pageIndex={pageIndex}
            pageCount={resolvedPageCount}
            onGoToPage={goToPage}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            onPreviousPage={() => table.previousPage()}
            onNextPage={() => table.nextPage()}
          />

          <div className="flex justify-center items-center w-full">
            <div
              className={cn(
                "absolute flex items-center bottom-4 bg-red-400 px-4 py-1 text-white  text-md shadow-md rounded-xl overflow-hidden transform transition-all duration-300 ease-in-out",
                loading?.isFetching
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10",
              )}
            >
              <span className="mr-2">
                <ButtonSpinner
                  size="default"
                  ariaLabel={t("loadingText")}
                />
              </span>
              {t("loadingText")}
            </div>
          </div>

          <DataTableCsvExportDialog
            key={csvExportDialogKey}
            open={csvExportDialogOpen}
            onOpenChange={setCsvExportDialogOpen}
            isServer={isServer}
            hasFullListExport={onExportFullList !== undefined}
            isExporting={csvExportLoading}
            onConfirm={handleCsvExportConfirm}
          />
          {csvExportLoading
            ? (renderCsvExportLoading?.() ?? null)
            : null}
        </div>
      </CardContent>
    </Card>
  );
}
