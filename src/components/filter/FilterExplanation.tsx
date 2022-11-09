import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import { Information, InformationFilled } from "@navikt/ds-icons";
import { v4 as uuid } from "uuid";
import styles from "./FilterExplanation.module.scss";
import { filterTexts } from "./filter-texts";

interface FilterExplanationProps {
  selectedFilters: string[];
  availableFilters: string[];
}

export const FilterExplanation = ({ selectedFilters, availableFilters }: FilterExplanationProps) => {
  const [explanationId] = useState(uuid());
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

  const { noFiltersSelected, filtersSelected } = filterTexts;

  const filterExplanationText = relevantSelectedFilters.length === 0 ? noFiltersSelected : filtersSelected;

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
          aria-labelledby={explanationId}
        />
        <Information
          className={classNames(styles.icon, {
            [styles.iconVisible]: !showHighlight,
            [styles.iconHidden]: showHighlight,
          })}
          role="img"
          focusable="false"
          aria-labelledby={explanationId}
        />
      </div>
      <div className={styles.text} id={explanationId}>
        {filterExplanationText}
      </div>
    </div>
  );
};
