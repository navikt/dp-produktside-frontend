import { groq } from "next-sanity";

const settingsGroq = `{
  title,
  content [_type == "produktsideSectionReference" ] {
    ...produktsideSection-> {
       iconName,
       title,
       content,
       slug,
       _updatedAt,
    }
  },
  supportLinks,
  _updatedAt,
}`;

const getAllFieldsGroq = `{
  ...
}`;

export const produktsideQuery = groq`{
    'settings': *[_id == "produktsideSettings" && __i18n_lang == $baseLang][0] {
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${settingsGroq}, ${settingsGroq})
    },
    'kortFortalt': *[_id == "produktsideKortFortalt" && __i18n_lang == $baseLang][0]{
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'filterSection': *[_id == "produktsideFilterSection" && __i18n_lang == $baseLang][0]{
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'seo': *[_id == "produktsideSEO" && __i18n_lang == $baseLang][0]{
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'contactOptions': *[_type == 'produktsideContactOptions' && __i18n_lang == $baseLang][0]{
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'generalTexts': *[_type == 'produktsideGeneralText' && __i18n_lang == $baseLang]{
      ...coalesce(* [_id==^._id + "__i18n_" + $lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
}`;

export const produktsideSectionIdsQuery = groq`{
  'sectionIds': *[_type == "produktsideSection" && __i18n_lang == $lang && !(_id in path("drafts.**"))]{
    _id
  }
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
