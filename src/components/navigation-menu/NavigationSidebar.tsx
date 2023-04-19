import { Heading } from "@navikt/ds-react";
import { MemoizedNavigationLink } from "./NavigationLink";
import styles from "./NavigationSidebar.module.scss";
import { AnchorLink, NavScrollDirection } from "./types";

interface Props {
  links: AnchorLink[];
  title?: string;
  currentIndex?: number;
  scrollDirection?: NavScrollDirection;
}

export function NavigationSidebar({ links, title, currentIndex, scrollDirection }: Props) {
  return (
    <nav className={styles.sidebar} aria-label={title}>
      {title && (
        <Heading level="2" size="medium" className={styles.title}>
          {title}
        </Heading>
      )}
      <ul className={styles.list}>
        {links.map(({ anchorId, linkText }, index) => (
          <li key={anchorId}>
            <MemoizedNavigationLink
              isCurrent={currentIndex === index}
              targetId={anchorId}
              scrollDirection={scrollDirection}
            >
              {linkText}
            </MemoizedNavigationLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
