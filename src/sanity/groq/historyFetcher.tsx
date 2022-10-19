import { sanityConfig } from "sanity/client";
import { SanityBlock } from "sanity/types";

export interface HistoriskDokument {
  _type: "produktsideSettings" | "produktsideSection";
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  kortFortalt?: SanityBlock[];
  content?: SanityBlock[];
  title: string;
}

export interface HistorikkResponse {
  documents: HistoriskDokument[];
}

const token = process.env.SANITY_READ_TOKEN;
const { projectId, dataset } = sanityConfig;

export async function historyFetcher(
  docId?: string | string[],
  revision?: string | string[]
): Promise<HistorikkResponse | null> {
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v1/data/history/${dataset}/documents/${docId}?revision=${revision}`;

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
