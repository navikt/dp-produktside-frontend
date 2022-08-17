import classnames from "classnames";
import NavigationMenu from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import styles from "./LeftMenuSection.module.scss";

type Props = {
  internalLinks: AnchorLink[];
  menuHeader: string;
  sticky?: boolean;
};

export const LeftMenuSection = ({ internalLinks, menuHeader, sticky }: Props) => {
  return (
    <div className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={menuHeader} anchorLinks={internalLinks} />
      {/* <Region pageProps={pageProps} regionProps={topRegionProps} /> */}
      {/* <EditorHelp
                text={
                    'Komponenter ovenfor legges inn rett under innholdsmenyen'
                }
            /> */}
      {/* <Region pageProps={pageProps} regionProps={mainRegionProps} /> */}
    </div>
  );
};
