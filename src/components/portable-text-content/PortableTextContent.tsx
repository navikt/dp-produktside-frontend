import { PortableText, PortableTextProps } from "@portabletext/react";
import { useFilterContext } from "components/filter/FilterContext";
import { HorizontalFilterMenu } from "components/filter/FilterMenu";
import { commonComponents } from "./components";
import { commonMarks } from "./marks/marks";
import { commonBlockStyles } from "./styles";

export function PortableTextContent({ value }: PortableTextProps) {
  const { selectedFilters, setSelectedFilters } = useFilterContext();

  const HorizontalFilterComponent = () => (
    <HorizontalFilterMenu
      selectedFilters={selectedFilters}
      onChange={(val) => {
        setSelectedFilters(val);
      }}
    />
  );

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
          produktsideFilterMenu: () => <HorizontalFilterComponent />,
          ...commonComponents,
        },
      }}
    />
  );
}
