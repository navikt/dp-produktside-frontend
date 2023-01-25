import * as NavIcons from "@navikt/ds-icons";
import { Link as LinkIcon } from "@navikt/ds-icons";
import { Heading, Panel } from "@navikt/ds-react";
import { CopyToClipboard } from "@navikt/ds-react-internal";
import classNames from "classnames";
import { useSanityContext } from "components/sanity-context/sanity-context";
import Config from "config";
import { ReactNode } from "react";
import styles from "./SectionWithHeader.module.scss";

interface Props {
  anchorId?: string;
  children: ReactNode;
  iconName?: string;
  title?: string;
}

export function SectionWithHeader({ anchorId, children, iconName, title }: Props) {
  const { getGeneralTextWithTextId } = useSanityContext();
  // @ts-ignore
  const Icon = NavIcons?.[iconName];

  return (
    <section id={Icon ? undefined : anchorId} className={Icon && styles.withIcon}>
      <Panel className={classNames(styles.container)}>
        {Icon && (
          <div id={Icon ? anchorId : undefined} className={styles.iconContainer} tabIndex={-1}>
            <Icon className={styles.icon} />
          </div>
        )}

        <div className={styles.heading}>
          {title && (
            <Heading size="large" level="2" className={styles.title}>
              {title}
            </Heading>
          )}

          {anchorId && (
            <CopyToClipboard
              className={styles.copyLink}
              copyText={Config.appUrls.produktsideAnchorUrl(anchorId)}
              popoverText={getGeneralTextWithTextId("copy-to-clipboard.popover-text")}
              size="small"
              icon={<LinkIcon title={getGeneralTextWithTextId("copy-to-clipboard.title")} />}
              popoverPlacement="right"
            >
              {getGeneralTextWithTextId("copy-to-clipboard.title")}
            </CopyToClipboard>
          )}
        </div>

        {children}
      </Panel>
    </section>
  );
}
