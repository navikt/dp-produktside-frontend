import { BodyShort, Detail } from "@navikt/ds-react";
import styles from "./Header.module.scss";
import { Money } from "@navikt/ds-icons";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.illustration}>
        <Money />
      </div>
      <div className={styles.text}>
        <h1>Dagpenger</h1>
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
