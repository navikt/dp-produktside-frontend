import { PortableText, PortableTextProps } from "@portabletext/react";
import { commonComponents } from "./components";
import { commonMarks } from "./marks/marks";
import { commonBlockStyles } from "./styles";
import { UnknownComponentType } from "./UnknownComponentType";

export function PortableTextContent({ value }: PortableTextProps) {
  return (
    <PortableText
      value={value || []}
      components={{
        block: commonBlockStyles,
        marks: commonMarks,
        types: {
          ...commonComponents,
        },
        unknownType: UnknownComponentType,
      }}
    />
  );
}
