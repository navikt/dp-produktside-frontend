import { Checkbox } from "@navikt/ds-react";
import { usePreviewContext } from "./previewContext";
import styles from "./PreviewBanner.module.scss";

export function PreviewBanner() {
  const [context, dispatch] = usePreviewContext();

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
