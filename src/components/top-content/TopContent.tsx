import { TypedObject } from "@portabletext/types";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import styles from "./TopContent.module.scss";

interface Props {
  value: TypedObject | TypedObject[];
}

export function TopContent({ value }: Props) {
  if (!value) {
    return null;
  }

  return (
    <section className={styles.container}>
      <PortableTextContent value={value} />
    </section>
  );
}
