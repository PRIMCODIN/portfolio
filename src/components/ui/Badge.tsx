import { cn } from "@/lib/cn";

/**
 * Badge de disponibilidad: el punto de acento es uno de los pocos sitios donde
 * aparece el color en toda la página.
 */
export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-small text-text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-pill bg-accent" />
      {children}
    </span>
  );
}
