import { Button } from "@navikt/ds-react";
import classnames from "classnames";
import { NavigationMenu } from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import styles from "./LeftMenuSection.module.scss";
import Config from "config";
import Link from "next/link";
import { LinkList } from "components/link-list/LinkList";
import { SupportLink } from "sanity-utils/types";

interface Props {
  internalLinks: AnchorLink[];
  supportLinks?: SupportLink[];
  menuHeader: string;
  sticky?: boolean;
}

export function LeftMenuSection({ internalLinks, supportLinks, menuHeader, sticky }: Props) {
  return (
    <section className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={menuHeader} anchorLinks={internalLinks} />

      <div className={styles.link}>
        <Link href={Config.appUrls.dagpengerSoknad} legacyBehavior>
          <Button variant="primary">Søk dagpenger</Button>
        </Link>
      </div>

      <LinkList links={supportLinks} title="Nyttig å vite" />
    </section>
  );
}
