export type SanityImage = {
  _type: "image";
  asset: any;
  crop: any;
  hotspot: any;
};

export type VisForConfig = {
  visForSituasjoner?: { _ref: string }[];
  skjulFor?: boolean;
  _type: "visFor";
};

export type MarkDef = {
  _key: string;
  _type: string;
  visFor?: VisForConfig;
  visPaaSider?: { _ref: string }[];
  href?: string;
};

// SanityBlock-typen er uhøytidelig hamret sammen basert på hvilke parametere jeg ser i consollen, det er ikke sikkert den stemmer helt
export type SanityBlock = {
  _key?: string;
  _type: string;
  children?: SanityBlock[];
  style?: string;
  text?: string;
  marks?: string[];
  markDefs?: MarkDef[];
  level?: number;
  listItem?: "bullet";
};

export interface CommonDocumentFields {
  _type: "produktsideSettings" | "produktsideKortFortalt" | "produktsideSection";
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  __i18n_lang: string;
  title?: string;
  content?: SanityBlock[];
}

export interface Slug {
  _type: "slug";
  current: string;
}

export interface SupportLink {
  title: string;
  url: string;
  targetBlank: boolean;
}

export interface HistoryProduktsideSettings extends CommonDocumentFields {
  _type: "produktsideSettings";
  supportLinks?: SupportLink[];
}
export interface HistoryProduktsideKortFortalt extends CommonDocumentFields {
  _type: "produktsideKortFortalt";
  slug?: Slug;
}
export interface HistoryProduktsideSection extends CommonDocumentFields {
  _type: "produktsideSection";
  slug?: Slug;
  iconName?: string;
}
