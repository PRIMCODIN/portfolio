import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";

export function Stack() {
  const { stack } = useContent();

  return (
    <Section
      id="stack"
      numero={3}
      etiqueta={stack.etiqueta}
      titulo={stack.titulo}
      intro={stack.intro}
    >
      {/* gap-px sobre el color de la retícula: las celdas se separan con una
          línea de 1px sin duplicar bordes entre vecinas. */}
      <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {stack.grupos.map((grupo, indice) => (
          <Reveal key={grupo.id} retardo={indice * 50} className="bg-bg">
            <div className="h-full p-6">
              <h3 className="label-mono">{grupo.titulo}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {grupo.items.map((item) => (
                  <li key={item}>
                    <Chip>{item}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
