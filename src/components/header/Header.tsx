import { BodyShort, Detail, Heading } from "@navikt/ds-react";
import Image from "next/image";
import styles from "./Header.module.scss";
//@ts-ignore
import svgIcon from "../../../public/static-dagpenger.svg";
import { formatLocaleDateWithMonthText } from "utils/dates";
import { useSanityContext } from "components/sanity-context/sanity-context";
// TODO: Finn en bedre måte å hente SVG-ikon på?
// NextJS klarer ikke bruke public-pathen når man bruker src="/static-dagpenger.svg".
// Sannsynligvis fordi vi har en src-mappe, men det gjenstår å undersøke dette.
//todo: legg inn logikk for sist oppdatert

interface Props {
  title?: string;
  lastUpdated?: Date;
}

export function Header({ title, lastUpdated }: Props) {
  const { getGeneralText } = useSanityContext();

  return (
    <header className={styles.header}>
      <div className={styles.illustration} aria-hidden="true" role="presentation">
        <Image className={styles.svgIcon} src={svgIcon} alt="Ikon for dagpenger" sizes="100vw" />
      </div>

      <div className={styles.text}>
        <Heading size={"xlarge"} level={"1"} spacing>
          {title}
        </Heading>
        <div className={styles.taglineWrapper}>
          <BodyShort size="small" className={styles.taglineLabel}>
            {getGeneralText("header.left-subtitle")}
          </BodyShort>
          {lastUpdated && (
            <>
              <span aria-hidden="true" className={styles.divider}>
                {"|"}
              </span>
              <Detail>
                <span className={styles.modifiedLabel}>
                  {`${getGeneralText("header.right-subtitle")} 
                  ${formatLocaleDateWithMonthText(lastUpdated)}`}
                </span>
              </Detail>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
