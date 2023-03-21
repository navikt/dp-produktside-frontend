import React, { ReactNode } from "react";

interface Props {
  content?: ReactNode;
}

const defaultContent = (
  <p>
    <strong>Hei!</strong> Dette er en bare en prototype til testing og utvikling.
    <br />
    <a href="https://www.nav.no/">Her er lenken til nav.no</a> om du har kommet feil.
  </p>
);

export function PrototypeBanner({ content = defaultContent }: Props) {
  return (
    <aside aria-label="Prototype-banner" className={"prototype-banner"}>
      <div className={"prototype-banner__wrapper"}>
        <div className={"prototype-banner__icon"}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M14 6v6a1 1 0 1 0 2 0V8.07A8 8 0 0 1 20 15v2.67L21 19H3l1-1.33V15a8 8 0 0 1 4-6.93V12a1 1 0 1 0 2 0V6.01a1 1 0 0 1 .84-.9l.19-.03a6 6 0 0 1 1.94 0l.2.03a1 1 0 0 1 .83.9Zm8 9v2l1.8 2.4A1 1 0 0 1 23 21H1a1 1 0 0 1-.8-1.6L2 17v-2a10 10 0 0 1 6.01-9.17 3 3 0 0 1 2.5-2.7l.2-.02a8 8 0 0 1 2.59 0l.19.03a3 3 0 0 1 2.5 2.69A10 10 0 0 1 22 15Zm-11 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className={"prototype-banner__content"}>{content}</div>
      </div>
    </aside>
  );
}
