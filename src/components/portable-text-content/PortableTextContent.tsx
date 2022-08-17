import { PortableText, PortableTextProps } from "@portabletext/react";

/* array of portable text blocks */
// const value = [];

/* optional object of custom components to use */
const components = {};

export default function PortableTextContent({ value }: PortableTextProps) {
  return <PortableText value={value} components={components} />;
}
