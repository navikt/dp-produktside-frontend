import { Money } from "@navikt/ds-icons";
import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.illustration}>
        <Money />
      </div>
      <div className={styles.text}>
        <Heading size={"xlarge"} level={"1"}>
          Dagpenger
        </Heading>
        <div className={styles.taglineWrapper}>
          <BodyShort size="small" className={styles.taglineLabel}>
            PENGESTØTTE
          </BodyShort>
          <span aria-hidden="true" className={styles.divider}>
            {"|"}
          </span>
          <Detail size="small" uppercase>
            <span className={styles.modifiedLabel}>I går</span>
          </Detail>
        </div>
      </div>
    </header>
  );
}
