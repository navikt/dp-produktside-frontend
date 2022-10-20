import { SupportLink } from "components/link-list/LinkList";
import { sanityConfig } from "sanity/client";
import { SanityBlock } from "sanity/types";

export interface CommonDocumentFields {
  _type: "produktsideSettings" | "produktsideKortFortalt" | "produktsideSection";
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  __i18n_lang: string;
  title?: string;
  content?: SanityBlock;
}

interface Slug {
  _type: "slug";
  current: string;
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

export interface HistorikkResponse<T> {
  documents: T[];
}

const token = process.env.SANITY_READ_TOKEN;
const { projectId, dataset } = sanityConfig;

export async function historyFetcher<T>(
  docId?: string | string[],
  time?: string | string[]
): Promise<HistorikkResponse<T> | null> {
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v1/data/history/${dataset}/documents/${docId}?time=${time}`;

    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (e) {
    // TODO logg til amplitude/sentry?
    console.error(e);
    return null;
  }
}
