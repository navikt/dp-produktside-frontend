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
  supportLinksTitle,
  supportLinks,
  _updatedAt,
}`;

const getAllFieldsGroq = `{
  ...
}`;

export const produktsideQuery = groq`{
    'header': *[_type=="produktsideHeader" && language==$baseLang][0] {
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'settings': *[_type=="produktsideSettings" && language==$baseLang][0] {
      ...coalesce(*[_id==^._id && language==$lang][0]${settingsGroq}, ${settingsGroq})
    },
    'kortFortalt': *[_type=="produktsideKortFortalt" && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'filterSection': *[_type=="produktsideFilterSection" && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'seo': *[_type=="produktsideSEO" && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'contactOptions': *[_type=='produktsideContactOptions' && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'generalTexts': *[_type=='produktsideGeneralText' && language==$baseLang]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'calculatorPage': *[_type=="produktsideCalculatorPage" && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
    'calculator': {
      ...*[_type=='produktsideCalculatorSettings' && language==$baseLang][0]{
        ...coalesce(* [_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
      },
      'texts' : *[_type=='produktsideCalculatorText' && language==$baseLang]{
        ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
      }
    },
    'topContent': *[_type=='produktsideTopContent' && language==$baseLang][0]{
      ...coalesce(*[_id==^._id && language==$lang][0]${getAllFieldsGroq}, ${getAllFieldsGroq})
    },
}`;

export const produktsideSectionIdsQuery = groq`{
  'sectionIds': *[_type=="produktsideSection" && language==$lang && !(_id in path("drafts.**"))]{
    _id
  }
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
