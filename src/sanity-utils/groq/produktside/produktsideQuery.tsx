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

export const produktsideQuery = `{
    'header': *[_type == "produktsideHeader" && language == $lang][0] ${getAllFieldsGroq},
    'settings': *[_type == "produktsideSettings" && language == $lang][0] ${settingsGroq},
    'kortFortalt': *[_type == "produktsideKortFortalt" && language == $lang][0] ${getAllFieldsGroq},
    'filterSection': *[_type == "produktsideFilterSection" && language == $lang][0] ${getAllFieldsGroq},
    'seo': *[_type == "produktsideSEO" && language == $lang][0] ${getAllFieldsGroq},
    'contactOptions': *[_type == 'produktsideContactOptions' && language == $lang][0] ${getAllFieldsGroq},
    'generalTexts': *[_type == 'produktsideGeneralText' && language == $lang] ${getAllFieldsGroq},
    'calculatorPage': *[_type == "produktsideCalculatorPage" && language == $lang][0] ${getAllFieldsGroq},
    'topContent': *[_type == 'produktsideTopContent' && language == $lang][0] ${getAllFieldsGroq},
    'calculator': {
      ...*[_type == 'produktsideCalculatorSettings' && language == $lang][0] ${getAllFieldsGroq},
      'texts' : *[_type == 'produktsideCalculatorText' && language == $lang] ${getAllFieldsGroq}
    },
}`;

export const produktsideSectionIdsQuery = `{
  'sectionIds': *[_type == "produktsideSection" && language == $lang && !(_id in path("drafts.**"))]{
    _id
  }
}`;

// TODO: Fix typescript definitions for results returned from produktsideQuery
