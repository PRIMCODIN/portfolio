import type { ComponentType } from "react";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  IconoAuriculares,
  IconoBocadillo,
  IconoDestello,
  IconoEscudo,
  IconoFlecha,
  IconoLibro,
  IconoLupa,
  IconoPersonaMas,
  IconoTraspaso,
  IconoVector,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import type { EsquemaAgente as Textos, PasoEsquema, UsoEsquema } from "@/content/types";
import { useContent } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";

type Icono = ComponentType<{ className?: string }>;

const ICONOS_PASO: Record<PasoEsquema["id"], Icono> = {
  pregunta: IconoBocadillo,
  entiende: IconoVector,
  busca: IconoLupa,
  responde: IconoDestello,
};

const ICONOS_USO: Record<UsoEsquema["id"], Icono> = {
  soporte: IconoAuriculares,
  captacion: IconoPersonaMas,
  derivacion: IconoTraspaso,
  documentacion: IconoLibro,
};

/** Titular de cada mitad del esquema: un escalón por debajo del h2. */
const TITULO_BLOQUE =
  "mt-3 text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight font-semibold tracking-[-0.015em]";

/** Bocadillo de quien pregunta, como en el chat. */
const BURBUJA_USUARIO =
  "w-fit max-w-full rounded-card rounded-br-sm bg-accent px-3 py-2 text-small text-accent-contrast";

function CirculoIcono({ icono: Icono, className }: { icono: Icono; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-pill border border-border bg-bg text-accent",
        className,
      )}
    >
      <Icono />
    </span>
  );
}

function Metrica({ children }: { children: string }) {
  return <p className="mt-2 font-mono text-[0.75rem] text-text-muted tabular-nums">{children}</p>;
}

/** Lo que ocurrió en cada paso con la pregunta de ejemplo. El turno es real
 *  y está en español en los dos idiomas: de ahí el lang="es". */
function Ejemplo({ paso, turno }: { paso: PasoEsquema; turno: Textos["turno"] }) {
  switch (paso.id) {
    case "pregunta":
      return (
        <p lang="es" className={cn(BURBUJA_USUARIO, "ml-auto")}>
          {turno.pregunta}
        </p>
      );
    case "entiende":
      return <p className="font-mono text-small break-words">{turno.vector}</p>;
    case "busca":
      return (
        <ul lang="es" className="flex flex-col gap-1 text-small">
          {turno.fuentes.map((fuente) => (
            <li key={fuente} className="break-words">
              {fuente}
            </li>
          ))}
        </ul>
      );
    case "responde":
      return (
        <p
          lang="es"
          className="rounded-card rounded-bl-sm border border-border bg-surface px-3 py-2 text-small"
        >
          {turno.respuesta}
        </p>
      );
  }
}

function Paso({
  paso,
  indice,
  ultimo,
  textos,
}: {
  paso: PasoEsquema;
  indice: number;
  ultimo: boolean;
  textos: Textos;
}) {
  const icono = ICONOS_PASO[paso.id];
  const destacado = paso.id === "responde";

  return (
    <Reveal
      as="li"
      retardo={indice * 60}
      className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0 lg:block lg:pb-0"
    >
      {/* Por debajo de lg: línea de tiempo vertical con el icono en un círculo. */}
      <div aria-hidden="true" className="relative flex justify-center lg:hidden">
        <CirculoIcono icono={icono} className="relative z-10" />
        {!ultimo && <span className="absolute top-10 -bottom-6 left-1/2 w-px bg-border" />}
      </div>

      <article
        className={cn(
          "flex h-full min-w-0 flex-col rounded-card border bg-bg p-5",
          destacado ? "border-accent" : "border-border",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-small text-text-muted tabular-nums">
            {String(indice + 1).padStart(2, "0")}
          </span>
          <CirculoIcono icono={icono} className="hidden lg:flex" />
        </div>

        <h4 className="mt-3 text-h3">{paso.titulo}</h4>
        <p className="mt-2 text-small text-text-muted">{paso.descripcion}</p>
        <Chip className="mt-4 self-start">{paso.tecnica}</Chip>

        <div className="mt-auto pt-5">
          <div className="rounded-sm bg-bg-subtle p-3">
            <p className="label-mono mb-2.5">{textos.ejemplo}</p>
            <Ejemplo paso={paso} turno={textos.turno} />
            {paso.metrica && <Metrica>{paso.metrica}</Metrica>}
          </div>
        </div>
      </article>

      {/* Desde lg: flecha en el hueco hasta la tarjeta siguiente. */}
      {!ultimo && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-full hidden w-8 -translate-y-1/2 justify-center text-text-muted lg:flex"
        >
          <IconoFlecha />
        </span>
      )}
    </Reveal>
  );
}

function Multitenant({ textos }: { textos: Textos["usos"]["multitenant"] }) {
  return (
    <div className="mt-12 grid gap-8 rounded-card border border-border p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <div className="lg:col-span-5">
        <h4 className="text-h3">{textos.titulo}</h4>
        <p className="mt-3 max-w-[52ch] text-small text-text-muted">{textos.descripcion}</p>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-7 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex h-12 shrink-0 items-center justify-center rounded-sm border border-accent px-6 font-mono text-small text-accent">
          {textos.api}
        </div>
        {/* Conectores solo desde lg: del API al tronco y del tronco a cada fila.
            Las filas miden h-12, así que el tronco va de centro a centro. */}
        <span aria-hidden="true" className="hidden h-px w-8 shrink-0 bg-border lg:block" />
        <ul className="relative flex min-w-0 flex-col gap-3 lg:flex-1 lg:pl-8">
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-0 hidden w-px bg-border lg:block"
          />
          {textos.inquilinos.map((inquilino) => (
            <li
              key={inquilino.id}
              className="relative flex h-12 items-center justify-between gap-3 rounded-sm border border-border bg-bg px-4 text-small"
            >
              <span
                aria-hidden="true"
                className="absolute top-1/2 -left-8 hidden h-px w-8 bg-border lg:block"
              />
              <span className="min-w-0 truncate">{inquilino.nombre}</span>
              <span
                className={cn(
                  "shrink-0 rounded-pill border px-2 py-0.5 font-mono text-[0.6875rem] tracking-[0.08em] uppercase",
                  inquilino.activo ? "border-accent text-accent" : "border-border text-text-muted",
                )}
              >
                {inquilino.estado}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Esquema estático bajo el chat: qué pasa con una pregunta, con los datos de
 * un turno real, y para qué más sirve el mismo sistema. Solo el botón es
 * interactivo; flechas, líneas y conectores son decorativos.
 */
export function EsquemaAgente({ alProbar }: { alProbar: () => void }) {
  const textos = useContent().agente.esquema;
  const { usos } = textos;

  return (
    <div className="pt-12 pb-[var(--section-y)] lg:pt-16">
      <Reveal>
        <header className="max-w-[64ch]">
          <p className="label-mono">{textos.etiqueta}</p>
          <h3 className={TITULO_BLOQUE}>{textos.titulo}</h3>
          <p className="mt-4 text-text-muted">
            {textos.subtitulo.antes}
            <span lang="es">{textos.turno.pregunta}</span>
            {textos.subtitulo.despues}
          </p>
        </header>
      </Reveal>

      <ol className="mt-10 lg:grid lg:grid-cols-4 lg:gap-8">
        {textos.pasos.map((paso, indice) => (
          <Paso
            key={paso.id}
            paso={paso}
            indice={indice}
            ultimo={indice === textos.pasos.length - 1}
            textos={textos}
          />
        ))}
      </ol>

      <Reveal className="mt-8">
        <div className="flex flex-col gap-3 rounded-card border border-dashed border-border p-5 sm:flex-row sm:items-center sm:gap-5">
          <CirculoIcono icono={IconoEscudo} />
          <div className="min-w-0">
            <h4 className="font-medium">{textos.limites.titulo}</h4>
            <ul className="mt-1 flex flex-col text-small text-text-muted sm:flex-row sm:flex-wrap">
              {textos.limites.items.map((item, indice) => (
                <li key={item}>
                  {indice > 0 && (
                    <span aria-hidden="true" className="hidden px-2 sm:inline">
                      ·
                    </span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-20 lg:mt-24">
        <header className="max-w-[64ch]">
          <p className="label-mono">{usos.etiqueta}</p>
          <h3 className={TITULO_BLOQUE}>{usos.titulo}</h3>
        </header>

        <article className="mt-8 grid gap-6 rounded-card border border-[color-mix(in_oklab,var(--color-accent)_35%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-accent)_8%,var(--color-surface))] p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-mono text-accent uppercase">
              <span aria-hidden="true" className="size-2 rounded-pill bg-accent" />
              {usos.destacado.indicador}
            </p>
            <h4 className="mt-4 text-h3">{usos.destacado.titulo}</h4>
            <p className="mt-3 max-w-[52ch] text-text-muted">{usos.destacado.descripcion}</p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end">
            <p className={BURBUJA_USUARIO}>{usos.destacado.ejemplo}</p>
            <Button variante="primario" onClick={alProbar}>
              {usos.destacado.boton}
            </Button>
          </div>
        </article>

        <h4 className="mt-12 font-medium">{usos.otrosTitulo}</h4>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {usos.otros.map((uso) => (
            <li
              key={uso.id}
              className="flex flex-col rounded-card border border-border bg-bg p-5"
            >
              <CirculoIcono icono={ICONOS_USO[uso.id]} />
              <h5 className="mt-4 font-medium">{uso.titulo}</h5>
              <p className="mt-3 w-fit max-w-full rounded-card rounded-br-sm border border-hairline bg-bg-subtle px-3 py-1.5 text-small">
                {uso.ejemplo}
              </p>
              <p className="mt-3 text-small text-text-muted">{uso.descripcion}</p>
            </li>
          ))}
        </ul>

        <Multitenant textos={usos.multitenant} />
      </Reveal>
    </div>
  );
}
