import { PortableText, PortableTextProps } from "@portabletext/react";
import { useFilterContext } from "components/filter-menu/FilterContext";
import { FilterMenu } from "components/filter-menu/FilterMenu";
import Config from "config";
import { useEffect, useRef, useState } from "react";
import { scrollIntoViewWithOffset } from "utils/scroll";
import { commonComponents } from "./components";
import { commonMarks } from "./marks/marks";
import { commonBlockStyles } from "./styles";

function FilterMenuComponent() {
  const { selectedFilters, setSelectedFilters } = useFilterContext();
  const [isTriggered, setIsTriggered] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isTriggered) {
      const scrollOffset = Config.vars.dekoratorenHeight;
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

export function PortableTextContent({ value }: PortableTextProps) {
  const { selectedFilters } = useFilterContext();

  return (
    <PortableText
      value={value || []}
      components={{
        block: commonBlockStyles,
        marks: commonMarks,
        types: {
          produktsideFilteredContent: ({ value }) => {
            const shouldShowFilteredContent =
              selectedFilters?.length === 0 ||
              value?.filters?.length === 0 ||
              value?.filters?.some((filter: string) => selectedFilters.includes(filter));

            if (!shouldShowFilteredContent) {
              return null;
            }

            return (
              <PortableText
                value={value?.content || []}
                components={{
                  block: commonBlockStyles,
                  marks: commonMarks,
                  types: commonComponents,
                }}
              />
            );
          },
          produktsideFilterMenu: FilterMenuComponent,
          ...commonComponents,
        },
      }}
    />
  );
}
