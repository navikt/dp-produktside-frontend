import { groq } from "next-sanity";

export const produktsideQuery = groq`{
    'oppsett': *[_type == "siteSettings"][0] {
      ...
    },

    'innholdsseksjoner': *[_type == "innholdsseksjon"] {
      ...
    }
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
