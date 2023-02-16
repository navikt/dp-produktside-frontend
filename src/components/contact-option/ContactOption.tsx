import { Heading } from "@navikt/ds-react";
import Link from "next/link";
import { MouseEventHandler, ReactNode, useState } from "react";
import * as NavIcons from "@navikt/ds-icons";
import { TypedObject } from "@portabletext/types";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { IContactOption, options } from "./options";
import styles from "./ContactOption.module.scss";

interface Props {
  title: string;
  content: TypedObject | TypedObject[];
  contactOption: IContactOption;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function ContactOption({ title, content, contactOption, href = "#", onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const { icon, hoverIcon } = options[contactOption];

  //@ts-ignore
  const IconComponent = NavIcons?.[isHovered ? hoverIcon : icon];

  return (
    <div className={styles.container}>
      <Link
        className={styles.link}
        target="_blank"
        href={href}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconComponent className={styles.icon} title="haha" />
        <Heading level="3" size="small">
          {title}
        </Heading>
      </Link>

      <PortableTextContent value={content} />
    </div>
  );
}
