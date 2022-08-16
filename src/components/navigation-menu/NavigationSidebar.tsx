import { Heading } from "@navikt/ds-react";
import { useState } from "react";
import { NavigationLink } from "./NavigationLink";
import styles from "./NavigationSidebar.module.scss";
import { AnchorLink, PageNavScrollDirection } from "./types";

interface Props {
  links: AnchorLink[];
  title?: string;
  currentIndex?: number;
  scrollDirection?: PageNavScrollDirection;
}

const NavigationSidebar = ({ links, title, currentIndex, scrollDirection }: Props) => {
  console.log("sidebar", links);
  return (
    <div className={styles.sidebar}>
      {title && (
        <Heading level="2" size="medium" className={styles.title}>
          {title}
        </Heading>
      )}

      <nav aria-label={"Innhold"}>
        <ul className={styles.list}>
          {links.map(({ anchorId, linkText }, index) => (
            <li key={anchorId}>
              <NavigationLink isCurrent={currentIndex === index} targetId={anchorId} scrollDirection={scrollDirection}>
                {linkText}
              </NavigationLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationSidebar;
