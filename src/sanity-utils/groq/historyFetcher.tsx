import { sanityConfig } from "sanity-utils/client";

const token = process.env.SANITY_READ_TOKEN;
const { projectId, dataset } = sanityConfig;

export interface HistorikkResponse<T> {
  documents: T[];
}

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
    const jsonResponse = await response.json();

    return jsonResponse;
  } catch (e) {
    // TODO logg til amplitude/sentry?
    console.error(e);
    return null;
  }
}
