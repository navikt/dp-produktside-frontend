import { BodyShort } from "@navikt/ds-react";
import classNames from "classnames";
import Link from "next/link";
import { memo, ReactNode } from "react";
import { smoothScrollToTarget } from "utils/scroll";
import { appUrls } from "utils/url";
import styles from "./NavigationLink.module.scss";
import { navigationAnchorOffsetPx } from "./NavigationMenu";
import navigationSidebarStyles from "./NavigationSidebar.module.scss";
import { NavScrollDirection } from "./types";
import { useRouter } from "next/router";

interface Props {
  targetId: string;
  children: ReactNode;
  isCurrent?: boolean;
  linkId?: string;
  scrollDirection?: NavScrollDirection;
}

function NavigationLink({ targetId, isCurrent, scrollDirection, children }: Props) {
  const { locale } = useRouter();
  const linkHref = `#${targetId}`;

  //@ts-ignore
  const setLocationHashAndScrollToTarget = (e) => {
    e.preventDefault();

    //@ts-ignore
    window.history.pushState(window.history.state, undefined, linkHref);

    smoothScrollToTarget(targetId, navigationAnchorOffsetPx);
  };

  return (
    <Link
      id={`${linkHref}-a`}
      href={linkHref}
      passHref={true}
      scroll={false}
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
        },
      )}
      onClick={setLocationHashAndScrollToTarget}
    >
      <span className={navigationSidebarStyles.decor} aria-hidden={true} />
      <BodyShort className={styles.linkText}>{children}</BodyShort>
    </Link>
  );
}

export const MemoizedNavigationLink = memo(NavigationLink);

NavigationLink.displayName = "NavigationLink";
