import * as AkselIcons from "@navikt/aksel-icons";
import { Heading } from "@navikt/ds-react";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
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
  const IconComponent = AkselIcons?.[isHovered ? hoverIcon : icon];

  return (
    <div className={styles.container}>
      <Link
        className={styles.link}
        href={href}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconComponent className={styles.icon} aria-hidden />
        <Heading level="3" size="small">
          {title}
        </Heading>
      </Link>

      <PortableTextContent value={content} />
    </div>
  );
}
