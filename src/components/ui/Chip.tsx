import { cn } from "@/lib/cn";

/** Etiqueta técnica pequeña: elementos de stack, estados, metadatos. */
export function Chip({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded-pill border border-border px-2.5 py-1 leading-none",
        className,
      )}
    >
      {children}
    </span>
  );
}
