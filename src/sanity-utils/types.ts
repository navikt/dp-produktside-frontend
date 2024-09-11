import { TypedObject } from "@portabletext/types";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";

export interface SanityImage extends SanityImageObject {
  _type: "image";
  imageAltText: string;
}
export interface CommonDocumentFields {
  _type: "produktsideSettings" | "produktsideKortFortalt" | "produktsideSection";
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  language: string;
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
  supportLinksTitle?: string;
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
