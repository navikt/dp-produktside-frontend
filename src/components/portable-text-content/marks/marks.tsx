import { Link } from "@navikt/ds-react";
import { PortableTextMarkComponent } from "@portabletext/react";
import { GtoNOK } from "./GtoNOK";
import styles from "../PortableTextContent.module.scss";

export const commonMarks: Record<string, PortableTextMarkComponent<any> | undefined> | undefined = {
  GtoNOK: GtoNOK,
  link: ({ children, value }) => {
    return (
      <Link href={value.href} className={styles.linkInline}>
        {children}
      </Link>
    );
  },
};
