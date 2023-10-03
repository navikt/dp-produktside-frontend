import { useEffect, useRef, useState } from "react";
import { useFilterContext } from "contexts/filter-context/FilterContext";
import { scrollIntoViewWithOffset } from "utils/scroll";
import { vars } from "utils/variables";
import { FilterMenu } from "./FilterMenu";

export function FilterMenuWithScroll() {
  const { selectedFilters, setSelectedFilters } = useFilterContext();
  const [isTriggered, setIsTriggered] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isTriggered) {
      const scrollOffset = vars.dekoratorenHeight;
      scrollIntoViewWithOffset(ref, scrollOffset);

      setIsTriggered(false);
    }
  }, [isTriggered, selectedFilters, setIsTriggered]);

  return (
    <div ref={ref}>
      <FilterMenu
        selectedFilters={selectedFilters}
        onChange={(val) => {
          setSelectedFilters(val);
          setIsTriggered(true);
        }}
      />
    </div>
  );
}
