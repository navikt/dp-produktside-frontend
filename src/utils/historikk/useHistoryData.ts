import Config from "config";
import { useEffect, useState } from "react";
import { HistorikkResponse } from "sanity/groq/historyFetcher";
import { HistoryProduktsideKortFortalt, HistoryProduktsideSection, HistoryProduktsideSettings } from "sanity/types";

const produktsideSettingsId = "produktsideSettings";
const produktsideKortFortaltId = "produktsideKortFortalt";

interface HistoryData {
  settings?: HistoryProduktsideSettings;
  kortFortalt?: HistoryProduktsideKortFortalt;
  contentSections?: HistoryProduktsideSection[];
}

export function useHistoryData(timestamp?: string) {
  const [historyData, setHistoryData] = useState<HistoryData>({});

  useEffect(() => {
    if (!timestamp) {
      return;
    }

    (async function () {
      async function fetchHistoryApi<T>(requestId: string | string[]) {
        const historyResponse = await fetch(`${Config.basePath}/api/history?requestId=${requestId}&time=${timestamp}`);
        const historyData = await historyResponse.json();

        return historyData as HistorikkResponse<T>;
      }

      const produktsideSettingsData = await fetchHistoryApi<HistoryProduktsideSettings>(produktsideSettingsId);
      const produktsideKortFortaltData = await fetchHistoryApi<HistoryProduktsideKortFortalt>(produktsideKortFortaltId);

      const produktsideSectionDocumentIds = produktsideSettingsData?.documents?.[0]?.content?.map(
        (section) => section?.produktsideSection?._ref
      );

      const produktsideSectionData = await fetchHistoryApi<HistoryProduktsideSection>(produktsideSectionDocumentIds);

      const newHistoryData = {
        settings: produktsideSettingsData?.documents?.[0],
        kortFortalt: produktsideKortFortaltData?.documents?.[0],
        contentSections: produktsideSectionData?.documents,
      };

      setHistoryData(newHistoryData);
    })();
  }, [timestamp]);

  return historyData;
}
