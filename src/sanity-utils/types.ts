import { TypedObject } from "@portabletext/types";

export type SanityImage = {
  _type: "image";
  asset: any;
  crop: any;
  hotspot: any;
};
export interface CommonDocumentFields {
  _type: "produktsideSettings" | "produktsideKortFortalt" | "produktsideSection";
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  __i18n_lang: string;
  title: string;
  content: TypedObject | TypedObject[];
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
  slug: Slug;
}
export interface HistoryProduktsideSection extends CommonDocumentFields {
  _type: "produktsideSection";
  slug: Slug;
  iconName?: string;
}

type SectionId = Pick<HistoryProduktsideSection, "_id">;

export interface HistorySectionIds {
  sectionIds: SectionId[];
}
