import { groq } from "next-sanity";

const innholdFields = `innhold [_type == "innholdsseksjonReference"]{
     ...innholdsseksjon-> {
        title,
        innhold,
        "anchorId": slug.current,
     }
}`;

export const produktsideQuery = groq`{
    'oppsett': *[_id == "siteSettings" && __i18n_lang == "nb"][0] {
      title,
      kortFortalt,
      "innholdsseksjoner": ${innholdFields},
    },
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
