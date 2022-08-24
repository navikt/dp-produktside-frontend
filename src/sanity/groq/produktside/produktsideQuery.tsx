import { groq } from "next-sanity";

const innholdFields = `innhold [_type == "innholdsseksjonReference"]{
     ...innholdsseksjon-> {
       title,
       innhold
     }
}`;

export const produktsideQuery = groq`{
    'oppsett': *[_type == "siteSettings"][0] {
      title,
      kortFortalt,
      "innholdsseksjoner": ${innholdFields}
    },
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
