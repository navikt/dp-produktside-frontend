import { Alert, Heading, ReadMore } from "@navikt/ds-react";
import { PortableTextTypeComponentProps, UnknownNodeType } from "@portabletext/react";
import styles from "./PortableTextContent.module.scss";

export function UnknownComponentType({ value }: PortableTextTypeComponentProps<UnknownNodeType>) {
  return (
    <Alert variant="warning">
      <Heading level="3" size="medium">
        Her var det en ukjent komponent
      </Heading>
      {value?._type && <p>Komponentnavn: {value._type}</p>}
      <ReadMore header="Rådata">
        <pre className={styles.pre}>{JSON.stringify(value)}</pre>
      </ReadMore>
    </Alert>
  );
}
