import { Button } from "@navikt/ds-react";
import classnames from "classnames";
import { LinkList } from "components/link-list/LinkList";
import { NavigationMenu } from "components/navigation-menu/NavigationMenu";
import { AnchorLink } from "components/navigation-menu/types";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { SupportLink } from "sanity-utils/types";
import { appUrls } from "utils/url";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import styles from "./LeftMenuSection.module.scss";

interface Props {
  internalLinks: AnchorLink[];
  supportLinks?: SupportLink[];
  sticky?: boolean;
}

export function LeftMenuSection({ internalLinks, supportLinks, sticky }: Props) {
  const { getGeneralText } = useSanityContext();

  const buttonLinkHref = appUrls.dagpengerSoknad;
  const buttonLinkText = getGeneralText("navigation-menu.button-title");

  return (
    <section className={classnames(styles.leftMenu, { [styles.leftMenuSticky]: sticky })}>
      <NavigationMenu title={getGeneralText("navigation-menu.title")} anchorLinks={internalLinks} />

      <div className={styles.link}>
        {/** TODO: Fiks flerspråklig url for denne knappen */}
        <Button
          as="a"
          href={buttonLinkHref}
          onClick={() => {
            logAmplitudeEvent(AnalyticsEvents.NAVIGATION, {
              destinasjon: buttonLinkHref,
              lenketekst: buttonLinkText,
              komponent: "Meny for intern-navigasjon",
              seksjon: "Innhold",
            });
          }}
          variant="primary"
        >
          {buttonLinkText}
        </Button>
      </div>

      <LinkList links={supportLinks} title={getGeneralText("support-links-menu.title")} />
    </section>
  );
}
