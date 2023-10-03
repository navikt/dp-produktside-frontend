import { PortableText, PortableTextTypeComponentProps } from "@portabletext/react";
import { commonComponents } from "components/portable-text-content/components";
import { commonMarks } from "components/portable-text-content/marks/marks";
import { commonBlockStyles } from "components/portable-text-content/styles";
import { useFilterContext } from "contexts/filter-context/FilterContext";

export function FilterContent({ value }: PortableTextTypeComponentProps<any>) {
  const { selectedFilters } = useFilterContext();

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
}
