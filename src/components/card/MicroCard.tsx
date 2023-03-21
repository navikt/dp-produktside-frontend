import Link from "next/link";
import classnames from "classnames";
import { BodyShort } from "@navikt/ds-react";
import { CardType } from "./types";
import sharedCardStyles from "./Card.module.scss";
import styles from "./MicroCard.module.scss";

interface IMicroCard {
  linkText: string;
  url: string;
  type: CardType;
}

interface MicroCardsProps {
  header?: string;
  cardList: IMicroCard[];
}

const MicroCard = ({ linkText, url, type }: IMicroCard) => {
  return (
    <Link href={url} className={classnames(sharedCardStyles.card, sharedCardStyles.inline)}>
      <div className={classnames(sharedCardStyles.bed, styles.micro, type)}>{linkText}</div>
    </Link>
  );
};

export const MicroCards = ({ header, cardList }: MicroCardsProps) => {
  return (
    <>
      {header && (
        <BodyShort size="medium" className={styles.header}>
          {header}
        </BodyShort>
      )}
      <div className={styles.wrapper}>
        {cardList.map(({ linkText, url, type }, index) => (
          <MicroCard linkText={linkText} url={url} type={type} key={index} />
        ))}
      </div>
    </>
  );
};
