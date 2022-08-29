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
    </div>
  );
}
