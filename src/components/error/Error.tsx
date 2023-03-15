import React from "react";
import { Alert, BodyShort, Detail } from "@navikt/ds-react";
import { PageMeta } from "../PageMeta";
import styles from "./Error.module.scss";

export function Error() {
  return (
    <div className={styles.container}>
      <PageMeta title={"Teknisk feil"} description="Beklager, det skjedde en teknisk feil." />
      <div className={styles.container}>
        <Alert variant="error">
          <BodyShort>Beklager, det skjedde en teknisk feil.</BodyShort>
          <Detail>
            Feilen blir automatisk rapportert og vi jobber med å løse den så raskt som mulig. Prøv igjen om litt.
          </Detail>
        </Alert>
      </div>
    </div>
  );
}
