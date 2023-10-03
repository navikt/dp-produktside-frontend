import { Heading } from "@navikt/ds-react";
import { useFilterContext } from "contexts/filter-context/FilterContext";
import { FilterMenu } from "components/filter-menu/FilterMenu";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import styles from "./FilterSection.module.scss";

export function FilterSection() {
  const { selectedFilters, setSelectedFilters } = useFilterContext();
  const { filterSection } = useSanityContext();

  if (!filterSection) {
    return null;
  }

  //@ts-ignore
  const { title, content, filterLabel } = filterSection;

  return (
    <section className={styles.container}>
      {title && (
        <Heading level="2" size="large" spacing>
          {title}
        </Heading>
      )}

      {content && (
        <div className={styles.content}>
          <PortableTextContent value={content} />
        </div>
      )}

      <FilterMenu
        legend={filterLabel}
        selectedFilters={selectedFilters}
        onChange={(val) => {
          setSelectedFilters(val);
        }}
      />
    </section>
  );
}
