import { notaPendiente } from "@/lib/contenido";

/**
 * Marca un dato aún sin confirmar. Solo existe durante el desarrollo: en la
 * compilación de producción este componente no pinta nada, de modo que ningún
 * marcador ni dato sin verificar llega a la web publicada.
 */
export function TodoMark({ valor }: { valor: unknown }) {
  const nota = notaPendiente(valor);
  if (!import.meta.env.DEV || !nota) return null;

  return (
    <span
      className="label-mono inline-flex items-center gap-1.5 rounded-sm border border-todo/40 px-2 py-1 text-todo"
      title={nota}
    >
      TODO
      <span className="normal-case tracking-normal opacity-80">{nota}</span>
    </span>
  );
}
