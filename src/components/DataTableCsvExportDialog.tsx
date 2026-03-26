"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "../lib/cn";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export type DataTableCsvExportScope = "currentPage" | "fullList";

export interface DataTableCsvExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isServer: boolean;
  hasFullListExport: boolean;
  isExporting: boolean;
  onConfirm: (scope: DataTableCsvExportScope) => void | Promise<void>;
}

export function DataTableCsvExportDialog({
  open,
  onOpenChange,
  isServer,
  hasFullListExport,
  isExporting,
  onConfirm,
}: DataTableCsvExportDialogProps) {
  const { t } = useTranslation();
  const [scope, setScope] = useState<DataTableCsvExportScope>("currentPage");

  const fullListDisabled = isServer && !hasFullListExport;

  const handleOpenChange = (next: boolean) => {
    if (!next && isExporting) return;
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (fullListDisabled && scope === "fullList") {
      return;
    }
    await onConfirm(scope);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("sm:max-w-md")}
        showCloseButton={!isExporting}
        onPointerDownOutside={(e) => {
          if (isExporting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isExporting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("dataTableCsvExportDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("dataTableCsvExportDialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={scope}
          onValueChange={(v) => setScope(v as DataTableCsvExportScope)}
          className="grid gap-3 py-2"
          disabled={isExporting}
        >
          <div className="flex items-start gap-3 rounded-md border border-border p-3">
            <RadioGroupItem value="currentPage" id="csv-scope-current" />
            <div className="grid gap-1">
              <Label
                htmlFor="csv-scope-current"
                className="font-medium cursor-pointer"
              >
                {t("dataTableCsvExportScopeCurrentPage")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("dataTableCsvExportScopeCurrentPageHint")}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-start gap-3 rounded-md border border-border p-3",
              fullListDisabled && "opacity-60",
            )}
          >
            <RadioGroupItem
              value="fullList"
              id="csv-scope-full"
              disabled={fullListDisabled}
            />
            <div className="grid gap-1">
              <Label
                htmlFor="csv-scope-full"
                className={cn(
                  "font-medium",
                  fullListDisabled ? "cursor-not-allowed" : "cursor-pointer",
                )}
              >
                {t("dataTableCsvExportScopeFullList")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {fullListDisabled
                  ? t("dataTableCsvExportFullListUnavailable")
                  : t("dataTableCsvExportScopeFullListHint")}
              </p>
            </div>
          </div>
        </RadioGroup>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isExporting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isExporting}
          >
            {t("dataTableCsvExportConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
