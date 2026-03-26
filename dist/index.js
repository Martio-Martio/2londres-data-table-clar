import { useReactTable, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table';
import Cookies from 'js-cookie';
import { Circle, MoreHorizontal, Download, X, XIcon, ChevronsUpDown, Loader2, Check, ChevronDownIcon, CheckIcon, SearchIcon, ChevronUpIcon } from 'lucide-react';
import * as React3 from 'react';
import React3__default, { useState, useId, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Command as Command$1 } from 'cmdk';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

// src/components/dataTableClar.tsx
var DATA_TABLE_EXPORT_MAX_ROWS = 5e4;
function clampExportLimit(totalItems) {
  return Math.min(Math.max(totalItems, 0), DATA_TABLE_EXPORT_MAX_ROWS);
}
function downloadCsvFromRows(rows, exportFileName, fileSuffix) {
  if (!rows.length) {
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${exportFileName}${fileSuffix}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function ButtonSpinner({
  size = "default",
  className,
  ariaLabel
}) {
  const sizeClass = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return /* @__PURE__ */ jsxs("div", { role: "status", "data-testid": "button-spinner", children: [
    /* @__PURE__ */ jsx(
      Loader2,
      {
        className: cn("mr-2 text-white animate-spin", sizeClass, className),
        "aria-hidden": true
      }
    ),
    ariaLabel ? /* @__PURE__ */ jsx("span", { className: "sr-only", children: ariaLabel }) : null
  ] });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
var Input = React3.forwardRef(
  function Input2({ className, type, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        ref,
        "data-slot": "input",
        className: cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          className
        ),
        ...props
      }
    );
  }
);
Input.displayName = "Input";
function Command({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1,
    {
      "data-slot": "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props
    }
  );
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border-b px-3",
      children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          Command$1.Input,
          {
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            ),
            ...props
          }
        )
      ]
    }
  );
}
function CommandList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.List,
    {
      "data-slot": "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      ),
      ...props
    }
  );
}
function CommandEmpty({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options available",
  loadingMessage = "Loading...",
  isLoading = false,
  disabled = false,
  className,
  buttonClassName,
  popoverClassName
}) {
  const [open, setOpen] = React3.useState(false);
  const getSelectedLabel = () => {
    const selected = options.find((option) => option.value === value);
    return selected ? selected.label : placeholder;
  };
  return /* @__PURE__ */ jsx("div", { className: cn("w-full", className), children: /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn("justify-between w-full h-11", buttonClassName),
        disabled: disabled || isLoading,
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: value ? getSelectedLabel() : placeholder }),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-2 w-4 h-4 opacity-50 shrink-0" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      PopoverContent,
      {
        className: cn(
          "p-0 w-full bg-background border-border shadow-lg",
          popoverClassName
        ),
        align: "start",
        children: /* @__PURE__ */ jsxs(Command, { className: "bg-background", children: [
          /* @__PURE__ */ jsx(CommandInput, { placeholder: searchPlaceholder, className: "h-9" }),
          /* @__PURE__ */ jsxs(CommandList, { children: [
            /* @__PURE__ */ jsx(CommandEmpty, { children: emptyMessage }),
            isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center p-4", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 w-4 h-4 animate-spin" }),
              loadingMessage
            ] }) : /* @__PURE__ */ jsx(CommandGroup, { children: options.map((option) => /* @__PURE__ */ jsxs(
              CommandItem,
              {
                value: option.label,
                onSelect: () => {
                  const newValue = option.value === value ? "" : option.value;
                  onValueChange?.(newValue);
                  setOpen(false);
                },
                children: [
                  /* @__PURE__ */ jsx(
                    Check,
                    {
                      className: cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: option.label })
                ]
              },
              option.value
            )) })
          ] })
        ] })
      }
    )
  ] }) });
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex w-fit items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm whitespace-nowrap shadow-sm transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
var Table = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
var TableHeader = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
var TableBody = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
var TableRow = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
var TableHead = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
var TableCell = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[101] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Label2({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
var RadioGroup = React3.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React3.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
function DataTableCsvExportDialog({
  open,
  onOpenChange,
  isServer,
  hasFullListExport,
  isExporting,
  onConfirm
}) {
  const { t } = useTranslation();
  const [scope, setScope] = useState("currentPage");
  const fullListDisabled = isServer && !hasFullListExport;
  const handleOpenChange = (next) => {
    if (!next && isExporting) return;
    onOpenChange(next);
  };
  const handleConfirm = async () => {
    if (fullListDisabled && scope === "fullList") {
      return;
    }
    await onConfirm(scope);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: cn("sm:max-w-md"),
      showCloseButton: !isExporting,
      onPointerDownOutside: (e) => {
        if (isExporting) e.preventDefault();
      },
      onEscapeKeyDown: (e) => {
        if (isExporting) e.preventDefault();
      },
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsx(DialogTitle, { children: t("dataTableCsvExportDialogTitle") }),
          /* @__PURE__ */ jsx(DialogDescription, { children: t("dataTableCsvExportDialogDescription") })
        ] }),
        /* @__PURE__ */ jsxs(
          RadioGroup,
          {
            value: scope,
            onValueChange: (v) => setScope(v),
            className: "grid gap-3 py-2",
            disabled: isExporting,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-md border border-border p-3", children: [
                /* @__PURE__ */ jsx(RadioGroupItem, { value: "currentPage", id: "csv-scope-current" }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                  /* @__PURE__ */ jsx(
                    Label2,
                    {
                      htmlFor: "csv-scope-current",
                      className: "font-medium cursor-pointer",
                      children: t("dataTableCsvExportScopeCurrentPage")
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("dataTableCsvExportScopeCurrentPageHint") })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "flex items-start gap-3 rounded-md border border-border p-3",
                    fullListDisabled && "opacity-60"
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      RadioGroupItem,
                      {
                        value: "fullList",
                        id: "csv-scope-full",
                        disabled: fullListDisabled
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
                      /* @__PURE__ */ jsx(
                        Label2,
                        {
                          htmlFor: "csv-scope-full",
                          className: cn(
                            "font-medium",
                            fullListDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          ),
                          children: t("dataTableCsvExportScopeFullList")
                        }
                      ),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: fullListDisabled ? t("dataTableCsvExportFullListUnavailable") : t("dataTableCsvExportScopeFullListHint") })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => handleOpenChange(false),
              disabled: isExporting,
              children: t("cancel")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              onClick: () => void handleConfirm(),
              disabled: isExporting,
              children: t("dataTableCsvExportConfirm")
            }
          )
        ] })
      ]
    }
  ) });
}

// src/lib/getVisiblePaginationSegments.ts
function getVisiblePaginationSegments(currentPage, totalPages, options) {
  if (totalPages <= 0) {
    return [];
  }
  const siblingCount = options?.siblingCount ?? 1;
  const current = Math.min(Math.max(1, currentPage), totalPages);
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      kind: "page",
      page: i + 1
    }));
  }
  const left = current - siblingCount;
  const right = current + siblingCount + 1;
  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || i >= left && i <= right) {
      range.push(i);
    }
  }
  const out = [];
  let last;
  for (const i of range) {
    if (last !== void 0) {
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
function PaginationGoToInput({
  pageIndex,
  pageCount,
  onGoToPage,
  inputId,
  labelId
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
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraft();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:ml-2", children: [
    /* @__PURE__ */ jsx(
      "label",
      {
        id: labelId,
        htmlFor: inputId,
        className: "text-xs font-medium text-muted-foreground whitespace-nowrap",
        children: t("dataTableGoToPageLabel")
      }
    ),
    /* @__PURE__ */ jsx(
      Input,
      {
        id: inputId,
        type: "number",
        inputMode: "numeric",
        min: 1,
        max: pageCount,
        "aria-labelledby": labelId,
        "aria-label": t("dataTablePaginationInputAria"),
        className: "h-9 w-16 text-center px-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        value: draftPage,
        onChange: (e) => setDraftPage(e.target.value),
        onBlur: commitDraft,
        onKeyDown
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground tabular-nums whitespace-nowrap", children: t("dataTablePaginationOfTotal", { total: pageCount }) })
  ] });
}
function DataTablePaginationBar({
  pageIndex,
  pageCount,
  onGoToPage,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  className
}) {
  const { t } = useTranslation();
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const current1Based = pageIndex + 1;
  const segments = useMemo(
    () => getVisiblePaginationSegments(current1Based, pageCount),
    [current1Based, pageCount]
  );
  if (pageCount <= 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-wrap justify-center items-center gap-2 py-4 max-w-full overflow-x-auto",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onPreviousPage,
            disabled: !canPreviousPage,
            "aria-label": t("dataTablePaginationPreviousAria"),
            children: t("previous")
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex flex-wrap items-center justify-center gap-1",
            role: "group",
            "aria-label": t("dataTablePaginationPagesGroupAria"),
            children: segments.map(
              (seg) => seg.kind === "ellipsis" ? /* @__PURE__ */ jsx(
                "span",
                {
                  className: "flex h-9 w-9 items-center justify-center text-muted-foreground",
                  "aria-hidden": true,
                  children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                },
                seg.key
              ) : /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: seg.page === current1Based ? "default" : "outline",
                  size: "sm",
                  className: "min-w-9",
                  onClick: () => onGoToPage(seg.page),
                  "aria-label": t("dataTablePaginationPageAria", {
                    page: seg.page,
                    total: pageCount
                  }),
                  "aria-current": seg.page === current1Based ? "page" : void 0,
                  children: seg.page
                },
                `page-${seg.page}`
              )
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onNextPage,
            disabled: !canNextPage,
            "aria-label": t("dataTablePaginationNextAria"),
            children: t("next")
          }
        ),
        /* @__PURE__ */ jsx(
          PaginationGoToInput,
          {
            pageIndex,
            pageCount,
            onGoToPage,
            inputId,
            labelId
          },
          `${pageIndex}-${pageCount}`
        )
      ]
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function DefaultEmptyTableRow() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
    TableCell,
    {
      colSpan: 100,
      className: "px-8 py-32 font-bold text-center text-gray-500 uppercase",
      children: t("noTableDataToDisplay")
    }
  ) });
}
function DefaultErrorTableRow({
  error
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 100, children: /* @__PURE__ */ jsxs("div", { className: "py-32 px-8 flex flex-col justify-center items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "font-bold uppercase text-danger", children: error?.message || t("tableErrorText") }),
    error?.refetch ? /* @__PURE__ */ jsx(
      Button,
      {
        className: "mt-4",
        onClick: error.refetch,
        variant: "secondary",
        size: "sm",
        children: t("reload")
      }
    ) : null
  ] }) }) });
}
function DefaultLoadingTable({
  numberOfColumns
}) {
  return /* @__PURE__ */ jsx(Fragment, { children: [...Array(8)].map((_, id) => /* @__PURE__ */ jsx("tr", { children: [...Array(numberOfColumns)].map((_2, _id) => /* @__PURE__ */ jsx("td", { className: "px-6 pb-4 align-top", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 min-w-[16px] flex items-center mt-4 space-x-3" }) }, _id)) }, id)) });
}
var numbersVolum = [
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
  { label: "20000", value: "20000" }
];
function DataTableClar({
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
  renderCsvExportLoading
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sorting, setSorting] = React3__default.useState([]);
  const [internalColumnFilters, setInternalColumnFilters] = React3__default.useState([]);
  const [internalPagination, setInternalPagination] = React3__default.useState({
    pageIndex: 0,
    pageSize: itemPerPage ? itemPerPage : 6
  });
  const paginationMode = paginationModeProp ?? "client";
  const isServer = paginationMode === "server";
  const showVolumeBuiltIn = !isServer && (enableClientVolumeControl ?? true) && renderVolumeControl === void 0;
  const columnFilters = columnFiltersProp ?? internalColumnFilters;
  const setColumnFilters = onColumnFiltersChangeProp ?? setInternalColumnFilters;
  const pagination = paginationProp ?? internalPagination;
  const setPagination = onPaginationChangeProp ?? setInternalPagination;
  const defineVolumGet = Cookies.get("defineVolum");
  const [defineVolum, setDefineVolum] = useState(
    defineVolumGet !== void 0 ? defineVolumGet : "100"
  );
  const [csvExportDialogOpen, setCsvExportDialogOpen] = useState(false);
  const [csvExportDialogKey, setCsvExportDialogKey] = useState(0);
  const [csvExportLoading, setCsvExportLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = React3__default.useState({});
  const [rowSelection, setRowSelection] = React3__default.useState({});
  const { pageIndex, pageSize } = pagination;
  const goToPage = (page) => {
    setPagination({ pageIndex: page - 1, pageSize });
  };
  const clientPageCount = useMemo(
    () => Math.max(1, Math.ceil((data?.length ?? 0) / pageSize) || 1),
    [data?.length, pageSize]
  );
  const resolvedPageCount = isServer ? Math.max(0, serverPageCount ?? 0) : clientPageCount;
  useEffect(() => {
    if (isServer && paginationProp !== void 0 && onPaginationChangeProp !== void 0 && columnFiltersProp === void 0 && onColumnFiltersChangeProp === void 0) {
      console.warn(
        "[DataTableClar] Mode server : branchez columnFilters et onColumnFiltersChange pour appliquer les filtres c\xF4t\xE9 API (React Query)."
      );
    }
  }, [
    isServer,
    paginationProp,
    onPaginationChangeProp,
    columnFiltersProp,
    onColumnFiltersChangeProp
  ]);
  const columnsWithSelection = useMemo(() => {
    if (!enableSelection) return columnsClar(navigate);
    const SelectionHeader = ({
      getIsAllRowsSelected,
      getIsSomeRowsSelected,
      getToggleAllRowsSelectedHandler
    }) => {
      const ref = useRef(null);
      const isSomeRowsSelected = getIsSomeRowsSelected();
      const isAllRowsSelected = getIsAllRowsSelected();
      useEffect(() => {
        if (ref.current) {
          ref.current.indeterminate = isSomeRowsSelected && !isAllRowsSelected;
        }
      }, [isSomeRowsSelected, isAllRowsSelected]);
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "select-all",
            ref,
            type: "checkbox",
            checked: isAllRowsSelected,
            onChange: getToggleAllRowsSelectedHandler(),
            className: "w-6 h-6 accent-primary"
          }
        ),
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "select-all",
            className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: t("selectAll")
          }
        )
      ] });
    };
    return [
      {
        id: "selection",
        header: (ctx) => /* @__PURE__ */ jsx(
          SelectionHeader,
          {
            getIsAllRowsSelected: ctx.table.getIsAllRowsSelected,
            getIsSomeRowsSelected: ctx.table.getIsSomeRowsSelected,
            getToggleAllRowsSelectedHandler: ctx.table.getToggleAllRowsSelectedHandler
          }
        ),
        cell: ({ row }) => /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChange: row.getToggleSelectedHandler(),
            className: "w-4 h-4 accent-primary",
            "aria-label": t("dataTableSelectRowAria")
          }
        ),
        size: 40,
        meta: { type: "selection" }
      },
      ...columnsClar(navigate)
    ];
  }, [enableSelection, columnsClar, navigate, t]);
  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getRowId: (row) => row.id,
    defaultColumn: {
      size: 150,
      minSize: 48,
      maxSize: 800
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...isServer ? {
      manualPagination: true,
      manualFiltering: true,
      pageCount: resolvedPageCount
    } : {
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel()
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    initialState: {
      pagination: {
        pageSize: itemPerPage ? itemPerPage : 4
      }
    },
    enableRowSelection: enableSelection
  });
  useEffect(() => {
    if (enableSelection && onSelectionChange) {
      const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
      onSelectionChange(selectedIds);
    }
  }, [rowSelection, enableSelection, onSelectionChange, table]);
  const handleCsvExportConfirm = async (scope) => {
    const showLoad = scope === "fullList" && isServer && onExportFullList !== void 0;
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
          rows,
          exportFileName,
          fileSuffix
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
          rows,
          exportFileName,
          "_complete"
        );
        setCsvExportDialogOpen(false);
      } else {
        const rows = table.getPrePaginationRowModel().rows.map((row) => row.original);
        if (!rows.length) {
          onNotifyWarning?.("noDataToExport");
          return;
        }
        downloadCsvFromRows(
          rows,
          exportFileName,
          "_complete"
        );
        setCsvExportDialogOpen(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("loadErrorDescription");
      onNotifyError?.(msg, 8e3);
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
  const renderFilter = (column) => {
    const columnMeta = column.columnDef.meta;
    switch (columnMeta?.type) {
      case "date_from": {
        const filterValue = column.getFilterValue() || {};
        return /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            placeholder: t("dataTableFilterDateStart"),
            value: filterValue.from ?? "",
            onChange: (event) => {
              const newFilter = { ...filterValue, from: event.target.value };
              column.setFilterValue(newFilter);
            },
            className: "max-w-sm"
          }
        );
      }
      case "date_end": {
        const filterValue = column.getFilterValue() || {};
        return /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            placeholder: t("dataTableFilterDateEnd"),
            value: filterValue.to ?? "",
            onChange: (event) => {
              const newFilter = { ...filterValue, to: event.target.value };
              column.setFilterValue(newFilter);
            },
            className: "max-w-sm"
          }
        );
      }
      case "date": {
        return /* @__PURE__ */ jsx(
          Input,
          {
            type: "date",
            placeholder: t("dataTableFilterByDate"),
            value: column.getFilterValue() ?? "",
            onChange: (event) => {
              column.setFilterValue(event.target.value);
            },
            className: "max-w-sm"
          }
        );
      }
      case "select": {
        const options = columnMeta.options || [];
        return /* @__PURE__ */ jsxs(
          Select,
          {
            onValueChange: (value) => {
              if (value === "Tout") {
                column.setFilterValue("");
              } else {
                column.setFilterValue(value);
              }
            },
            value: column.getFilterValue() ?? "Tout",
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px] bg-white border-2 border-border hover:border-primary focus:border-primary shadow-sm", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: t("dataTableSelectPlaceholder") }) }),
              /* @__PURE__ */ jsx(SelectContent, { className: "bg-white border-2 border-border shadow-lg", children: options.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
            ]
          }
        );
      }
      case "text": {
        return /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: t("dataTableFilterByColumn", {
              column: column.columnDef.header ?? column.id
            }),
            value: column.getFilterValue() ?? "",
            onChange: (event) => column.setFilterValue(event.target.value),
            className: "max-w-sm"
          }
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
  const showSkeletonInsteadOfRows = Boolean(loading?.isLoading) || loading?.isFetching === true && data.length === 0;
  const showEmptyTable = !loading?.isFetching && !error?.message && (isServer ? (totalItemsCount ?? 0) === 0 : !numberOfRows);
  const columnLayoutTotal = table.getVisibleLeafColumns().reduce((sum, col) => sum + col.getSize(), 0) || 1;
  const loadingFallback = renderLoading?.({ numberOfColumns }) ?? /* @__PURE__ */ jsx(DefaultLoadingTable, { numberOfColumns });
  const emptyFallback = renderEmpty?.() ?? /* @__PURE__ */ jsx(DefaultEmptyTableRow, {});
  const errorFallback = renderError?.(error ?? { message: "" }) ?? /* @__PURE__ */ jsx(DefaultErrorTableRow, { error });
  return /* @__PURE__ */ jsxs(Card, { className: "mt-1 bg-white shadow-lg", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold", children: title }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 items-center py-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-row space-x-2", children: table.getAllColumns().map((column) => {
        if (column.id === "selection") return null;
        const columnMeta = column.columnDef.meta;
        if (columnMeta?.type === "denied") return null;
        return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: column.id,
              className: "text-xs font-semibold text-muted-foreground",
              children: column.columnDef.header
            }
          ),
          renderFilter(column)
        ] }, column.id);
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-0 justify-end items-end py-1", children: [
        renderVolumeControl,
        showVolumeBuiltIn ? /* @__PURE__ */ jsxs("div", { className: "w-[200px]", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: t("dataTableVolumeLabel") }),
          /* @__PURE__ */ jsx(
            SearchableSelect,
            {
              options: numbersVolum,
              value: defineVolum,
              onValueChange: (value) => {
                if (value) {
                  setDefineVolum(value);
                  Cookies.set("defineVolum", value);
                  onNotifyInfo?.(
                    t("dataTableVolumeReloadNotice", { value })
                  );
                  setTimeout(() => {
                    window.location.reload();
                  }, 1e3);
                }
              },
              placeholder: t("dataTableVolumeLabel"),
              searchPlaceholder: t("search"),
              emptyMessage: t("dataTableNoSelectOptions"),
              buttonClassName: "bg-white border-2 border-border hover:border-primary focus:border-primary shadow-sm font-medium",
              popoverClassName: "bg-white border-2 border-border shadow-lg"
            }
          )
        ] }) : null,
        showCsvExportButton ? /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            onClick: () => {
              setCsvExportDialogKey((k) => k + 1);
              setCsvExportDialogOpen(true);
            },
            className: "ml-2",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "mr-2 w-4 h-4" }),
              t("dataTableCsvExportOpenButton")
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: resetFilters,
            variant: "destructive",
            className: "ml-2",
            children: [
              /* @__PURE__ */ jsx(X, { className: "mr-2 w-4 h-4" }),
              t("dataTableResetFilters")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-0 justify-end items-end py-1", children: data ? /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: isServer ? t("dataTableElementsCount", {
        current: data.length,
        total: totalItemsCount ?? 0
      }) : t("dataTableClientElementsCount", {
        current: data.length,
        volume: defineVolum || ""
      }) }) : "" }),
      /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { className: "table-fixed", children: [
        /* @__PURE__ */ jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header) => {
          const meta = header.column.columnDef.meta;
          const headerAlign = header.column.id === "selection" ? "center" : meta?.headerAlign ?? "left";
          const widthPercent = header.getSize() / columnLayoutTotal * 100;
          return /* @__PURE__ */ jsx(
            TableHead,
            {
              colSpan: header.colSpan,
              style: { width: `${widthPercent}%` },
              className: cn(
                headerAlign === "left" && "text-left",
                headerAlign === "center" && "text-center",
                headerAlign === "right" && "text-right"
              ),
              children: header.isPlaceholder ? null : flexRender(
                header.column.columnDef.header,
                header.getContext()
              )
            },
            header.id
          );
        }) }, headerGroup.id)) }),
        /* @__PURE__ */ jsx(TableBody, { children: showSkeletonInsteadOfRows ? /* @__PURE__ */ jsx(Fragment, { children: loading?.loaderComponent ?? loadingFallback }) : error?.message ? errorFallback : showEmptyTable ? emptyFallback : /* @__PURE__ */ jsx(Fragment, { children: table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx(TableRow, { children: row.getVisibleCells().map((cell) => {
          const meta = cell.column.columnDef.meta;
          const cellAlign = cell.column.id === "selection" ? "center" : meta?.cellAlign ?? "left";
          const widthPercent = cell.column.getSize() / columnLayoutTotal * 100;
          return /* @__PURE__ */ jsx(
            TableCell,
            {
              style: { width: `${widthPercent}%` },
              className: cn(
                cellAlign === "left" && "text-left",
                cellAlign === "center" && "text-center",
                cellAlign === "right" && "text-right"
              ),
              children: flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )
            },
            cell.id
          );
        }) }, row.id)) }) })
      ] }) }),
      /* @__PURE__ */ jsx(
        DataTablePaginationBar,
        {
          pageIndex,
          pageCount: resolvedPageCount,
          onGoToPage: goToPage,
          canPreviousPage: table.getCanPreviousPage(),
          canNextPage: table.getCanNextPage(),
          onPreviousPage: () => table.previousPage(),
          onNextPage: () => table.nextPage()
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center w-full", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "absolute flex items-center bottom-4 bg-red-400 px-4 py-1 text-white  text-md shadow-md rounded-xl overflow-hidden transform transition-all duration-300 ease-in-out",
            loading?.isFetching ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: /* @__PURE__ */ jsx(
              ButtonSpinner,
              {
                size: "default",
                ariaLabel: t("loadingText")
              }
            ) }),
            t("loadingText")
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        DataTableCsvExportDialog,
        {
          open: csvExportDialogOpen,
          onOpenChange: setCsvExportDialogOpen,
          isServer,
          hasFullListExport: onExportFullList !== void 0,
          isExporting: csvExportLoading,
          onConfirm: handleCsvExportConfirm
        },
        csvExportDialogKey
      ),
      csvExportLoading ? renderCsvExportLoading?.() ?? null : null
    ] }) })
  ] });
}

// src/lib/dateRangeFilterFn.tsx
var dateRangeFilterFn = (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  const { from, to } = filterValue || {};
  if (!from && !to) return true;
  if (!rowValue) return false;
  let rowDate;
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

export { DATA_TABLE_EXPORT_MAX_ROWS, DataTableClar, DataTableCsvExportDialog, DataTablePaginationBar, clampExportLimit, dateRangeFilterFn, downloadCsvFromRows, getVisiblePaginationSegments };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map