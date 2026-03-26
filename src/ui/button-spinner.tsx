import { Loader2 } from "lucide-react";

import { cn } from "../lib/cn";

export function ButtonSpinner({
  size = "default",
  className,
  ariaLabel,
}: {
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Libellé pour lecteurs d’écran (ex. clé i18n résolue côté parent). */
  ariaLabel?: string;
}) {
  const sizeClass =
    size === "lg" ? "w-10 h-10" : size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div role="status" data-testid="button-spinner">
      <Loader2
        className={cn("mr-2 text-white animate-spin", sizeClass, className)}
        aria-hidden
      />
      {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
    </div>
  );
}
