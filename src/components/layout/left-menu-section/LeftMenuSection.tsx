import { Button } from "@navikt/ds-react";
import classnames from "classnames";
import { NavigationMenu } from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import styles from "./LeftMenuSection.module.scss";
import Config from "config";
import Link from "next/link";
import { LinkList } from "components/link-list/LinkList";
import { SupportLink } from "sanity-utils/types";
import { useSanityContext } from "components/sanity-context/sanity-context";

interface Props {
  internalLinks: AnchorLink[];
  supportLinks?: SupportLink[];
  sticky?: boolean;
}

export function LeftMenuSection({ internalLinks, supportLinks, sticky }: Props) {
  const { getGeneralTextWithTextId } = useSanityContext();

  return (
    <section className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={getGeneralTextWithTextId("navigation-menu.title")} anchorLinks={internalLinks} />

      <div className={styles.link}>
        <Link href={Config.appUrls.dagpengerSoknad} legacyBehavior>
          <Button variant="primary">{getGeneralTextWithTextId("navigation-menu.button-title")}</Button>
        </Link>
      </div>

      <LinkList links={supportLinks} title={getGeneralTextWithTextId("support-links-menu.title")} />
    </section>
  );
}
