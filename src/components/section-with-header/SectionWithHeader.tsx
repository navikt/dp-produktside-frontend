import * as AkselIcons from "@navikt/aksel-icons";
import * as NavIcons from "@navikt/ds-icons";
import { Link as LinkIcon } from "@navikt/ds-icons";
import { CopyButton, Heading, Panel } from "@navikt/ds-react";
import classNames from "classnames";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
import { appUrls } from "utils/url";
import { ReactNode } from "react";
import styles from "./SectionWithHeader.module.scss";
import { useRouter } from "next/router";

interface Props {
  anchorId?: string;
  children: ReactNode;
  iconName?: string;
  title?: string;
}

export function SectionWithHeader({ anchorId, children, iconName, title }: Props) {
  const { locale } = useRouter();
  const { getGeneralText } = useSanityContext();

  // @ts-ignore
  const akselIcon = AkselIcons?.[iconName];

  // @ts-ignore
  const navIcon = NavIcons?.[iconName];

  // @ts-ignore
  const Icon = akselIcon ?? navIcon;

  return (
    <section id={Icon ? undefined : anchorId} className={Icon && styles.withIcon}>
      <Panel className={classNames(styles.container)}>
        {Icon && (
          <div id={Icon ? anchorId : undefined} className={styles.iconContainer} tabIndex={-1}>
            <Icon className={akselIcon ? styles.akselIcon : styles.icon} aria-hidden />
          </div>
        )}

        <div className={styles.heading}>
          {title && (
            <Heading size="large" level="2" className={styles.title}>
              {title}
            </Heading>
          )}

          {anchorId && (
            <CopyButton
              className={styles.copyLink}
              text={getGeneralText("copy-to-clipboard.title")}
              activeText={getGeneralText("copy-to-clipboard.popover-text")}
              copyText={appUrls.produktsideProductionURL({ anchorId, locale: locale })}
              size="small"
              icon={<LinkIcon aria-hidden />}
              activeIcon={<LinkIcon aria-hidden />}
            />
          )}
        </div>

        {children}
      </Panel>
    </section>
  );
}
