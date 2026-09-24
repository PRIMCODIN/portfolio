import { useMemo } from "react";

import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { IconoEnlaceExterno } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";

export function Contact() {
  const { contacto, disponibilidad } = useContent();

  // El email se compone en ejecución: la dirección no aparece literal en el
  // HTML que se sirve, que es lo que rastrean los recolectores de spam.
  const email = useMemo(
    () => contacto.emailPartes.join(String.fromCharCode(64)),
    [contacto.emailPartes],
  );

  const enlaces = [
    {
      id: "email",
      label: contacto.emailEtiqueta,
      valor: email,
      href: `mailto:${email}`,
      externo: false,
    },
    {
      id: "linkedin",
      label: contacto.linkedin.label,
      valor: "victor-prim-romero",
      href: contacto.linkedin.href,
      externo: true,
    },
    {
      id: "github",
      label: contacto.github.label,
      valor: "PRIMCODIN",
      href: contacto.github.href,
      externo: true,
    },
  ];

  return (
    <Section id="contacto" titulo={contacto.titulo} intro={contacto.intro}>
      <ul>
        {enlaces.map((enlace, indice) => (
          <Reveal key={enlace.id} retardo={indice * 60} as="li">
            <a
              href={enlace.href}
              {...(enlace.externo ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-hairline py-7 transition-colors duration-[--duration-fast] hover:text-accent"
            >
              <span className="label-mono">{enlace.label}</span>
              <span className="flex items-center gap-2 text-h3">
                {enlace.valor}
                {enlace.externo && <IconoEnlaceExterno className="opacity-60" />}
              </span>
            </a>
          </Reveal>
        ))}
      </ul>

      <Reveal retardo={200}>
        <div className="mt-12 border-t border-hairline pt-12">
          <Badge>{disponibilidad}</Badge>
        </div>
      </Reveal>
    </Section>
  );
}
