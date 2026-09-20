import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Ancho máximo y márgenes laterales comunes a toda la página. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-grid", className)}>{children}</div>;
}
