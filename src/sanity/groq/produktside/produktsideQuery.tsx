import { groq } from "next-sanity";
import { SanityBlock } from "../../types";

export const produktsideQuery = groq`{
    'produktside': *[_type == "produktside"] {
        ...
    },
  }`;

export interface IProduktside {
  id: string;
  _updatedAt: string;
  title?: string;
  innhold?: SanityBlock;
  kortFortalt?: SanityBlock;
}
