import { PortableText, PortableTextProps } from "@portabletext/react";
import { FilterContent } from "components/filter-content/FilterContent";
import { FilterMenuWithScroll } from "components/filter-menu/FilterMenuWithScroll";
import { commonComponents } from "./components";
import { commonMarks } from "./marks/marks";
import { commonBlockStyles } from "./styles";

export function PortableTextContent({ value }: PortableTextProps) {
  return (
    <PortableText
      value={value || []}
      components={{
        block: commonBlockStyles,
        marks: commonMarks,
        types: {
          produktsideFilteredContent: FilterContent,
          produktsideFilterMenu: FilterMenuWithScroll,
          ...commonComponents,
        },
      }}
    />
  );
}
