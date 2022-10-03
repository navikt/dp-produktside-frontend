import { groq } from "next-sanity";

const produktsideSectionReferenceQuery = `content [_type == "produktsideSectionReference"]{
     ...produktsideSection-> {
        iconName,
        title,
        content,
        slug,
     }
}`;

export const produktsideQuery = groq`{
    'settings': *[_id == "produktsideSettings" && __i18n_lang == "nb"][0] {
      title,
      ${produktsideSectionReferenceQuery},
      supportLinks,
    },
    'kortFortalt': *[_id == "produktsideKortFortalt" && __i18n_lang == "nb"][0],
    "calculatorTexts": *[_type == "produktsideText" && textId match "kalkulator*" && __i18n_lang == "nb"]{
      ...,
      "plainText": pt::text(valueBlock)
    }
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
