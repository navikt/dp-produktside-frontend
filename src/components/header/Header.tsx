import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import Image from "next/image";
import styles from "./Header.module.scss";
//@ts-ignore
import svgIcon from "../../../public/static-dagpenger.svg";
// TODO: Finn en bedre måte å hente SVG-ikon på?
// NextJS klarer ikke bruke public-pathen når man bruker src="/static-dagpenger.svg".
// Sannsynligvis fordi vi har en src-mappe, men det gjenstår å undersøke dette.

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.illustration}>
        <Image src={svgIcon} layout="responsive" />
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
