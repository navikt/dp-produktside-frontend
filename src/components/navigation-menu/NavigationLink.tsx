import { Label } from "@navikt/ds-react";
import classNames from "classnames";
import Link from "next/link";
import { memo, ReactNode } from "react";
import { smoothScrollToTarget } from "utils/scroll";
import styles from "./NavigationLink.module.scss";
import { navigationAnchorOffsetPx } from "./NavigationMenu";
import navigationSidebarStyles from "./NavigationSidebar.module.scss";
import { NavScrollDirection } from "./types";

interface Props {
  targetId: string;
  children: ReactNode;
  isCurrent?: boolean;
  linkId?: string;
  scrollDirection?: NavScrollDirection;
}

function NavigationLink({ targetId, isCurrent, scrollDirection, children }: Props) {
  //@ts-ignore
  const setLocationHashAndScrollToTarget = (e) => {
    e.preventDefault();

    //@ts-ignore
    window.history.pushState(window.history.state, undefined, `#${targetId}`);

    smoothScrollToTarget(targetId, navigationAnchorOffsetPx);
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
}

export const MemoizedNavigationLink = memo(NavigationLink);

NavigationLink.displayName = "NavigationLink";
