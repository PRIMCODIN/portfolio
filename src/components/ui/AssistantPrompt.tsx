import { useState } from "react";

import { useContent } from "@/i18n/locale-context";
import { abrirWidget, cargarWidget, configuracionWidget } from "@/lib/chatWidget";
import { Button } from "./Button";

/**
 * Bloque «Pregúntale a mi asistente». Si el widget no está configurado, este
 * componente no pinta nada: el sitio no depende de él en ningún momento.
 */
export function AssistantPrompt() {
  const { asistente } = useContent();
  const [cargando, setCargando] = useState(false);
  const config = configuracionWidget();

  if (!config) return null;

  const abrir = () => {
    setCargando(true);
    cargarWidget(config)
      .then(abrirWidget)
      .catch(() => {
        /* Si el widget no responde, el resto de vías de contacto siguen ahí. */
      })
      .finally(() => setCargando(false));
  };

  return (
    <aside className="rounded-card border border-border p-7">
      <p className="label-mono">{asistente.etiqueta}</p>
      <h3 className="mt-4 text-h3">{asistente.titulo}</h3>
      <p className="mt-3 max-w-[52ch] text-small text-text-muted">{asistente.descripcion}</p>
      <Button variante="secundario" onClick={abrir} className="mt-6">
        {cargando ? `${asistente.cta}…` : asistente.cta}
      </Button>
    </aside>
  );
}
