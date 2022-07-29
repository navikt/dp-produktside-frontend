import React from "react";
import { Heading } from "@navikt/ds-react";
import style from "./LeftMenu.module.scss";

type AnchorLink = {
  anchorId: string;
  linkText: string;
};

type Props = {
  title?: string;
  links: AnchorLink[];
  currentIndex?: number;
};

const LeftMenu = ({ title, links, currentIndex = 0 }: Props) => {
  return (
    <div className={style.leftMenu}>
      {title && (
        <Heading level="2" size="medium" className={style.title}>
          {title}
        </Heading>
      )}

      <nav aria-label={"Innhold"}>
        <ul className={style.list}>
          {links.map((anchorLink, index) => (
            <li key={anchorLink.anchorId}>{anchorLink.linkText}</li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default LeftMenu;
