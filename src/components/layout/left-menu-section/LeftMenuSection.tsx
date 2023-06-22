import { Button } from "@navikt/ds-react";
import classnames from "classnames";
import { LinkList } from "components/link-list/LinkList";
import { NavigationMenu } from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import { SupportLink } from "sanity-utils/types";
import styles from "./LeftMenuSection.module.scss";

interface Props {
  title?: string;
  supportLinksTitle?: string;
  supportLinks?: SupportLink[];
  internalLinks: AnchorLink[];
  sticky?: boolean;
}

export function LeftMenuSection({ title, supportLinksTitle, supportLinks, internalLinks, sticky }: Props) {
  return (
    <section className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={title} anchorLinks={internalLinks} />

      <LinkList links={supportLinks} title={supportLinksTitle} />
    </section>
  );
}
