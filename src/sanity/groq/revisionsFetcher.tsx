import { sanityConfig } from "sanity/client";

interface RawRevision {
  author: string;
  documentIDs: string[];
  id: string;
  mutations: never[];
  timestamp: string;
}

export interface Revision extends Omit<RawRevision, "author" | "documentIDs" | "mutations"> {}

const token = process.env.SANITY_READ_TOKEN;
const { projectId, dataset } = sanityConfig;

export async function revisionsFetcher(docId: string): Promise<Revision[]> {
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v1/data/history/${dataset}/transactions/${docId}?excludeContent=true`;

    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // https://stackoverflow.com/questions/60634337/when-using-fetch-how-to-convert-response-body-from-application-x-ndjson-to-appli
    if (response.status != 200) {
      // TODO logg til amplitude/sentry?
      return [];
    }
    const text = await response.text();
    const revisions: RawRevision[] | undefined = text.match(/.+/g)?.map((it) => JSON.parse(it));

    if (!revisions) {
      return [];
    }

    // Begrenser litt hva vi sender til frontenden
    return revisions.map(({ id, timestamp }) => ({ id, timestamp }));
  } catch (e) {
    // TODO logg til amplitude/sentry?
    console.error(e);
    return [];
  }
}
