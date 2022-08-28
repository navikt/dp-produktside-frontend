import classnames from "classnames";
import { NavigationMenu } from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import styles from "./LeftMenuSection.module.scss";

interface Props {
  internalLinks: AnchorLink[];
  menuHeader: string;
  sticky?: boolean;
}

export function LeftMenuSection({ internalLinks, menuHeader, sticky }: Props) {
  return (
    <section className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={menuHeader} anchorLinks={internalLinks} />
    </section>
  );
}
