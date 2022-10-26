import * as NavIcons from "@navikt/ds-icons";
import { Link as LinkIcon } from "@navikt/ds-icons";
import { Heading, Panel } from "@navikt/ds-react";
import { CopyToClipboard } from "@navikt/ds-react-internal";
import classNames from "classnames";
import Config from "config";
import { ReactNode } from "react";
import styles from "./SectionWithHeader.module.scss";

interface Props {
  anchorId?: string;
  children: ReactNode;
  iconName?: string;
  title: string;
}

export function SectionWithHeader({ anchorId, children, iconName, title }: Props) {
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
          <Heading size="large" level="2" className={styles.title}>
            {title}
          </Heading>

          {anchorId && (
            <CopyToClipboard
              className={styles.copyLink}
              copyText={Config.appUrls.produktsideAnchorUrl(anchorId)}
              popoverText="Lenken er kopiert"
              size="small"
              icon={<LinkIcon title="Kopier lenke" />}
              popoverPlacement="right"
            >
              Kopier lenke
            </CopyToClipboard>
          )}
        </div>

        {children}
      </Panel>
    </section>
  );
}
