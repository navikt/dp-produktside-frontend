import React from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import styles from "./LinkList.module.scss";
import Link from "next/link";

export interface SupportLink {
  title: string;
  url: string;
  targetBlank: boolean;
}

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
      {title && (
        <Heading size="small" level="2" className={styles.title}>
          {title}
        </Heading>
      )}

      <nav className={styles.linkList}>
        {/* TODO: Legge til nofollowurl for eksterne lenker her for bedre SEO */}
        {links?.map(({ url, title, targetBlank }, index) => (
          <Link href={url} key={index}>
            <a className={styles.link} target={targetBlank ? "_blank" : "_self"}>
              <BodyShort className={styles.linkText} as={"span"}>
                {title}
              </BodyShort>
            </a>
          </Link>
        ))}
      </nav>
    </section>
  );
}
