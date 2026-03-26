"use client";

import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export function DefaultEmptyTableRow() {
  const { t } = useTranslation();
  return (
    <TableRow>
      <TableCell
        colSpan={100}
        className="px-8 py-32 font-bold text-center text-gray-500 uppercase"
      >
        {t("noTableDataToDisplay")}
      </TableCell>
    </TableRow>
  );
}

export function DefaultErrorTableRow({
  error,
}: {
  error?: { message: string; refetch?: () => void };
}) {
  const { t } = useTranslation();
  return (
    <TableRow>
      <TableCell colSpan={100}>
        <div className="py-32 px-8 flex flex-col justify-center items-center">
          <div className="font-bold uppercase text-danger">
            {error?.message || t("tableErrorText")}
          </div>
          {error?.refetch ? (
            <Button
              className="mt-4"
              onClick={error.refetch}
              variant="secondary"
              size="sm"
            >
              {t("reload")}
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DefaultLoadingTable({
  numberOfColumns,
}: {
  numberOfColumns: number;
}) {
  return (
    <>
      {[...Array(8)].map((_, id) => (
        <tr key={id}>
          {[...Array(numberOfColumns)].map((_, _id) => (
            <td key={_id} className="px-6 pb-4 align-top">
              <Skeleton className="h-4 min-w-[16px] flex items-center mt-4 space-x-3" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
