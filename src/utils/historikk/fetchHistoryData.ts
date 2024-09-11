import { HistorikkResponse } from "sanity-utils/groq/historyFetcher";
import {
  HistoryProduktsideKortFortalt,
  HistoryProduktsideSection,
  HistoryProduktsideSettings,
} from "sanity-utils/types";

export interface HistoryData {
  settings?: HistoryProduktsideSettings;
  kortFortalt?: HistoryProduktsideKortFortalt;
  contentSections?: HistoryProduktsideSection[];
}

export interface HistoryOptions {
  basePath: string;
  timestamp: string;
}

export async function fetchHistoryData({ basePath, timestamp }: HistoryOptions) {
  async function fetchHistoryApi<T>(requestId: string | string[]) {
    const historyResponse = await fetch(`${basePath}/api/history?requestId=${requestId}&time=${timestamp}`);
    const historyData = await historyResponse.json();
    return historyData as HistorikkResponse<T>;
  }

  const produktsideSettingsData = await fetchHistoryApi<HistoryProduktsideSettings>("produktsideSettingsId");
  const produktsideKortFortaltData = await fetchHistoryApi<HistoryProduktsideKortFortalt>("produktsideKortFortaltId");

  // TODO: Fiks typescript
  // @ts-ignore
  const produktsideSectionDocumentIds = produktsideSettingsData?.documents?.[0]?.content?.map(
    // @ts-ignore
    (section) => section?.produktsideSection?._ref,
  );
  const produktsideSectionData = await fetchHistoryApi<HistoryProduktsideSection>(produktsideSectionDocumentIds);

  const newHistoryData = {
    settings: produktsideSettingsData?.documents?.[0],
    kortFortalt: produktsideKortFortaltData?.documents?.[0],
    contentSections: produktsideSectionData?.documents,
  };

  return newHistoryData;
}
