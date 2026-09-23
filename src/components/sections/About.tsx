import { Section, type PropsSeccion } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";

export function About({ numero }: PropsSeccion) {
  const { sobreMi } = useContent();

  return (
    <Section id="sobre-mi" numero={numero} etiqueta={sobreMi.etiqueta} titulo={sobreMi.titulo}>
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="space-y-6">
            {sobreMi.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 24)}>{parrafo}</p>
            ))}
          </div>
        </Reveal>

        <Reveal retardo={80} className="lg:col-span-4 lg:col-start-9">
          <dl>
            {sobreMi.datos.map((dato) => (
              <div key={dato.id} className="border-t border-hairline py-4">
                <dt className="label-mono">{dato.clave}</dt>
                <dd className="mt-2 text-small">{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
