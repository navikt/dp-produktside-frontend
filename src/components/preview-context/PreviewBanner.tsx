import { Checkbox } from "@navikt/ds-react";
import { usePreviewContext } from "./previewContext";
import styles from "./PreviewBanner.module.scss";
import { useEffect, useState } from "react";

export function PreviewBanner() {
  const [context, dispatch] = usePreviewContext();
  const [testbanner, setTestbanner] = useState(false);

  useEffect(() => {
    if (location.hostname.includes("localhost") || location.hostname.includes("dev.nav.no")) {
      setTestbanner(true);
    }
  }, []);

  if (testbanner && !context.previewMode) {
    return (
      <div className={styles.container}>
        <p>TEST PAGE</p>
        <p>PLEASE IGNORE</p>
      </div>
    );
  }

  if (!context.previewMode) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p>Preview</p>
      <p>{context.dataset}</p>
      <Checkbox
        className={styles.checkbox}
        checked={context.showDrafts}
        onChange={() => dispatch({ showDrafts: !context.showDrafts })}
      >
        Show drafts
      </Checkbox>
    </div>
  );
}
