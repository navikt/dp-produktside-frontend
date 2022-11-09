import { Accordion, BodyLong, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";
import { filterTexts } from "./filter-texts";
import styles from "./FilterSection.module.scss";

interface Props {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function FilterSection({
  title = filterTexts.tellUsAboutYourSituation,
  description = filterTexts.filterSectionDescription,
  children,
}: Props) {
  return (
    <section className={styles.container}>
      {title && (
        <Heading level="2" size="large" spacing>
          {title}
        </Heading>
      )}

      {description && <BodyLong className={styles.description}>{description}</BodyLong>}

      {children}
    </section>
  );
}
