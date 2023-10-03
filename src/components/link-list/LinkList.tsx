import { BodyShort, Heading } from "@navikt/ds-react";
import styles from "./LinkList.module.scss";
import Link from "next/link";
import { SupportLink } from "sanity-utils/types";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";

interface Props {
  title?: string;
  links?: SupportLink[];
}

export function LinkList({ title, links }: Props) {
  if (links?.length === 0) {
    return null;
  }

  return (
    <section className={styles.container} aria-label={title}>
      <nav aria-label={title}>
        {title && (
          <Heading size="small" level="2" className={styles.title}>
            {title}
          </Heading>
        )}

        {/* TODO: Legge til nofollowurl for eksterne lenker her for bedre SEO */}
        <ul className={styles.linkList}>
          {links?.map(({ url, title: linkText, targetBlank }, index) => (
            <li key={index} className={styles.linkListElement}>
              <Link
                href={url}
                className={styles.link}
                target={targetBlank ? "_blank" : "_self"}
                onClick={() => {
                  logAmplitudeEvent(AnalyticsEvents.NAVIGATION, {
                    destinasjon: url,
                    lenketekst: linkText,
                    komponent: "Lenkeliste for støtteinformasjon",
                    seksjon: "Nyttig å vite",
                  });
                }}
              >
                <BodyShort className={styles.linkText} as="span">
                  {linkText}
                </BodyShort>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
