import * as NavIcons from "@navikt/ds-icons";
import { Link as LinkIcon } from "@navikt/ds-icons";
import { CopyButton, Heading, Panel } from "@navikt/ds-react";
import classNames from "classnames";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { appUrls } from "utils/url";
import { ReactNode } from "react";
import styles from "./SectionWithHeader.module.scss";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";

interface Props {
  anchorId?: string;
  children: ReactNode;
  iconName?: string;
  title?: string;
}

export function SectionWithHeader({ anchorId, children, iconName, title }: Props) {
  const { getGeneralText } = useSanityContext();
  // @ts-ignore
  const Icon = NavIcons?.[iconName];

  return (
    <section id={Icon ? undefined : anchorId} className={Icon && styles.withIcon}>
      <Panel className={classNames(styles.container)}>
        {Icon && (
          <div id={Icon ? anchorId : undefined} className={styles.iconContainer} tabIndex={-1}>
            <Icon className={styles.icon} aria-hidden />
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
              copyText={appUrls.produktsideProductionUrl(anchorId)}
              size="small"
              icon={<LinkIcon aria-hidden />}
              activeIcon={<LinkIcon aria-hidden />}
              onClick={() => {
                logAmplitudeEvent(AnalyticsEvents.COPY_LINK, {
                  seksjon: title,
                });
              }}
            />
          )}
        </div>

        {children}
      </Panel>
    </section>
  );
}
