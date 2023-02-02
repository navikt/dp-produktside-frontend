import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";

export function KortFortaltSection() {
  const { kortFortalt } = useSanityContext();

  return (
    <SectionWithHeader title={kortFortalt?.title} anchorId={kortFortalt?.slug?.current}>
      <PortableTextContent value={kortFortalt?.content} />
    </SectionWithHeader>
  );
}
