"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../lib/cn";
import { getVisiblePaginationSegments } from "../lib/getVisiblePaginationSegments";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

function PaginationGoToInput({
  pageIndex,
  pageCount,
  onGoToPage,
  inputId,
  labelId,
}: {
  pageIndex: number;
  pageCount: number;
  onGoToPage: (page1Based: number) => void;
  inputId: string;
  labelId: string;
}) {
  const { t } = useTranslation();
  const current1Based = Math.min(pageIndex + 1, pageCount);
  const [draftPage, setDraftPage] = useState(() => String(current1Based));

  const commitDraft = useCallback(() => {
    const parsed = parseInt(draftPage, 10);
    if (Number.isNaN(parsed)) {
      setDraftPage(String(current1Based));
      return;
    }
    const clamped = Math.min(Math.max(1, parsed), pageCount);
    onGoToPage(clamped);
    setDraftPage(String(clamped));
  }, [draftPage, pageCount, current1Based, onGoToPage]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:ml-2">
      <label
        id={labelId}
        htmlFor={inputId}
        className="text-xs font-medium text-muted-foreground whitespace-nowrap"
      >
        {t("dataTableGoToPageLabel")}
      </label>
      <Input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={1}
        max={pageCount}
        aria-labelledby={labelId}
        aria-label={t("dataTablePaginationInputAria")}
        className="h-9 w-16 text-center px-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={draftPage}
        onChange={(e) => setDraftPage(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={onKeyDown}
      />
      <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
        {t("dataTablePaginationOfTotal", { total: pageCount })}
      </span>
    </div>
  );
}

export interface DataTablePaginationBarProps {
  pageIndex: number;
  pageCount: number;
  onGoToPage: (page1Based: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  className?: string;
}

export function DataTablePaginationBar({
  pageIndex,
  pageCount,
  onGoToPage,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  className,
}: DataTablePaginationBarProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const labelId = `${inputId}-label`;

  const current1Based = pageIndex + 1;

  const segments = useMemo(
    () => getVisiblePaginationSegments(current1Based, pageCount),
    [current1Based, pageCount],
  );

  if (pageCount <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center items-center gap-2 py-4 max-w-full overflow-x-auto",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPreviousPage}
        disabled={!canPreviousPage}
        aria-label={t("dataTablePaginationPreviousAria")}
      >
        {t("previous")}
      </Button>

      <div
        className="flex flex-wrap items-center justify-center gap-1"
        role="group"
        aria-label={t("dataTablePaginationPagesGroupAria")}
      >
        {segments.map((seg) =>
          seg.kind === "ellipsis" ? (
            <span
              key={seg.key}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground"
              aria-hidden
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={`page-${seg.page}`}
              type="button"
              variant={seg.page === current1Based ? "default" : "outline"}
              size="sm"
              className="min-w-9"
              onClick={() => onGoToPage(seg.page)}
              aria-label={t("dataTablePaginationPageAria", {
                page: seg.page,
                total: pageCount,
              })}
              aria-current={seg.page === current1Based ? "page" : undefined}
            >
              {seg.page}
            </Button>
          ),
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={!canNextPage}
        aria-label={t("dataTablePaginationNextAria")}
      >
        {t("next")}
      </Button>

      <PaginationGoToInput
        key={`${pageIndex}-${pageCount}`}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onGoToPage={onGoToPage}
        inputId={inputId}
        labelId={labelId}
      />
    </div>
  );
}
