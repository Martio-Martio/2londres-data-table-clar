import * as react_jsx_runtime from 'react/jsx-runtime';
import { ColumnDef, PaginationState, OnChangeFn, ColumnFiltersState, FilterFn } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { NavigateFunction } from 'react-router-dom';

type DataTableColumnMetaType = {
    type: "date_from" | "date_end" | "date" | "select" | "text" | "denied" | "selection";
    options?: {
        value: string;
        label: string;
    }[];
    headerAlign?: "left" | "center" | "right";
    cellAlign?: "left" | "center" | "right";
};
interface DataTableRowBase {
    id: string;
}
interface DataTableClarProps<TData extends DataTableRowBase = DataTableRowBase> {
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
    renderLoading?: (ctx: {
        numberOfColumns: number;
    }) => ReactNode;
    renderEmpty?: () => ReactNode;
    renderError?: (error: {
        message: string;
        refetch?: () => void;
    }) => ReactNode;
    renderCsvExportLoading?: () => ReactNode;
}
declare function DataTableClar<TData extends DataTableRowBase = DataTableRowBase>({ data, exportFileName, title, error, loading, itemPerPage, columnsClar, enableSelection, onSelectionChange, paginationMode: paginationModeProp, pagination: paginationProp, onPaginationChange: onPaginationChangeProp, columnFilters: columnFiltersProp, onColumnFiltersChange: onColumnFiltersChangeProp, serverPageCount, totalItemsCount, onExportFullList, showCsvExportButton, enableClientVolumeControl, renderVolumeControl, onNotifyWarning, onNotifyError, onNotifyInfo, renderLoading, renderEmpty, renderError, renderCsvExportLoading, }: DataTableClarProps<TData>): react_jsx_runtime.JSX.Element;

type DataTableCsvExportScope = "currentPage" | "fullList";
interface DataTableCsvExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isServer: boolean;
    hasFullListExport: boolean;
    isExporting: boolean;
    onConfirm: (scope: DataTableCsvExportScope) => void | Promise<void>;
}
declare function DataTableCsvExportDialog({ open, onOpenChange, isServer, hasFullListExport, isExporting, onConfirm, }: DataTableCsvExportDialogProps): react_jsx_runtime.JSX.Element;

interface DataTablePaginationBarProps {
    pageIndex: number;
    pageCount: number;
    onGoToPage: (page1Based: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPreviousPage: () => void;
    onNextPage: () => void;
    className?: string;
}
declare function DataTablePaginationBar({ pageIndex, pageCount, onGoToPage, canPreviousPage, canNextPage, onPreviousPage, onNextPage, className, }: DataTablePaginationBarProps): react_jsx_runtime.JSX.Element | null;

declare const dateRangeFilterFn: FilterFn<unknown>;

/** Plafond de lignes pour un export « liste complète » via l’API (évite des requêtes démesurées). */
declare const DATA_TABLE_EXPORT_MAX_ROWS = 50000;
declare function clampExportLimit(totalItems: number): number;
/**
 * Télécharge un CSV UTF-8 (BOM) à partir d’un tableau d’objets (souvent des lignes TanStack `original`).
 */
declare function downloadCsvFromRows<T extends Record<string, unknown>>(rows: T[], exportFileName: string, fileSuffix: string): void;

/**
 * Segments pour afficher une pagination compacte (pages + ellipses).
 * `currentPage` et les pages retournées sont en base 1.
 */
type PaginationSegment = {
    kind: "page";
    page: number;
} | {
    kind: "ellipsis";
    key: string;
};
type GetVisiblePaginationSegmentsOptions = {
    /** Pages de chaque côté de la page courante (défaut : 1). */
    siblingCount?: number;
};
/**
 * Construit la liste des segments (numéros + ellipses) sans dupliquer les pages.
 */
declare function getVisiblePaginationSegments(currentPage: number, totalPages: number, options?: GetVisiblePaginationSegmentsOptions): PaginationSegment[];

export { DATA_TABLE_EXPORT_MAX_ROWS, DataTableClar, type DataTableClarProps, type DataTableColumnMetaType, DataTableCsvExportDialog, type DataTableCsvExportDialogProps, type DataTableCsvExportScope, DataTablePaginationBar, type DataTablePaginationBarProps, type DataTableRowBase, type GetVisiblePaginationSegmentsOptions, type PaginationSegment, clampExportLimit, dateRangeFilterFn, downloadCsvFromRows, getVisiblePaginationSegments };
