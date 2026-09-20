import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";

export function Now() {
  const { ahora } = useContent();

  return (
    <Section id="ahora" numero={6} etiqueta={ahora.etiqueta} titulo={ahora.titulo}>
      <div className="grid lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <div className="space-y-6 text-h3 font-normal text-text-muted">
            {ahora.parrafos.map((parrafo) => (
              <p key={parrafo.slice(0, 24)}>{parrafo}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
