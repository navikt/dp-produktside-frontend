import classNames from "classnames";
import { useState, useEffect, useRef, useId } from "react";
import { Information, InformationFilled } from "@navikt/ds-icons";
import { useSanityContext } from "components/sanity-context/sanity-context";
import styles from "./FilterExplanation.module.scss";

interface FilterExplanationProps {
  selectedFilters: string[];
  availableFilters: string[];
}

export const FilterExplanation = ({ selectedFilters, availableFilters }: FilterExplanationProps) => {
  const { getGeneralText } = useSanityContext();
  const explanationId = useId();
  const [selectCount, setSelectCount] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);

  const highlightTimeoutRef = useRef(null);
  const relevantSelectedFilters = selectedFilters.filter((filterId) => availableFilters.includes(filterId));

  useEffect(() => {
    if (selectCount !== relevantSelectedFilters.length) {
      setShowHighlight(true);
      setSelectCount(relevantSelectedFilters.length);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      //@ts-ignore
      highlightTimeoutRef!.current = setTimeout(() => {
        setShowHighlight(false);
      }, 2000);
    }
  }, [relevantSelectedFilters, selectCount]);

  const filterExplanationText =
    relevantSelectedFilters.length === 0
      ? getGeneralText("filter-explanation.no-filters-selected")
      : getGeneralText("filter-explanation.filters-selected");

  return (
    <div
      className={classNames(styles.filterExplanation, { [styles.filterExplanationHighlight]: showHighlight })}
      aria-live="assertive"
    >
      <div className={styles.iconWrapper}>
        <InformationFilled
          color="#006A23"
          className={classNames(styles.icon, {
            [styles.iconVisible]: showHighlight,
            [styles.iconHidden]: !showHighlight,
          })}
          role="img"
          focusable="false"
          titleId={explanationId}
        />
        <Information
          className={classNames(styles.icon, {
            [styles.iconVisible]: !showHighlight,
            [styles.iconHidden]: showHighlight,
          })}
          role="img"
          focusable="false"
          titleId={explanationId}
        />
      </div>
      <div className={styles.text} id={explanationId}>
        {filterExplanationText}
      </div>
    </div>
  );
};
