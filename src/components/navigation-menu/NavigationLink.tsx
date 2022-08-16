import { Label } from "@navikt/ds-react";
import classNames from "classnames";
import Link from "next/link";
import React, { ReactNode } from "react";
import { smoothScrollToTarget } from "utils/scroll";
import styles from "./NavigationLink.module.scss";
import navigationSidebarStyles from "./NavigationSidebar.module.scss";
import { PageNavScrollDirection } from "./types";
import { pageNavigationAnchorOffsetPx } from "./NavigationMenu";

interface Props {
  targetId: string;
  children: ReactNode;
  isCurrent?: boolean;
  linkId?: string;
  scrollDirection?: PageNavScrollDirection;
}

export const NavigationLink = React.memo(({ targetId, isCurrent, scrollDirection, children }: Props) => {
  //@ts-ignore
  const setLocationHashAndScrollToTarget = (e) => {
    e.preventDefault();

    //@ts-ignore
    window.history.pushState(window.history.state, undefined, `#${targetId}`);

    smoothScrollToTarget(targetId, pageNavigationAnchorOffsetPx);
  };

  return (
    <Link id={`#${targetId}-a`} href={`#${targetId}`} passHref={true} scroll={false}>
      <a
        className={classNames(
          styles.navLink,
          navigationSidebarStyles.navLink,
          {
            [navigationSidebarStyles.up]: scrollDirection === "up",
          },
          {
            [navigationSidebarStyles.down]: scrollDirection === "down",
          },
          {
            [navigationSidebarStyles.current]: isCurrent,
          }
        )}
        onClick={setLocationHashAndScrollToTarget}
      >
        <span className={navigationSidebarStyles.decor} aria-hidden={true} />
        <Label>{children}</Label>
      </a>
    </Link>
  );
});

NavigationLink.displayName = "NavigationLink";
