import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HistorikkResponse } from "sanity-utils/groq/historyFetcher";
import {
  HistoryProduktsideKortFortalt,
  HistoryProduktsideSection,
  HistoryProduktsideSettings,
} from "sanity-utils/types";

interface HistoryData {
  settings?: HistoryProduktsideSettings;
  kortFortalt?: HistoryProduktsideKortFortalt;
  contentSections?: HistoryProduktsideSection[];
}

export function useHistoryData(timestamp?: string) {
  const { basePath, locale } = useRouter();
  const [historyData, setHistoryData] = useState<HistoryData>({});
  const lang = locale ?? "nb";
  const localeId = lang !== "nb" ? `__i18n_${lang}` : "";
  const produktsideSettingsId = `produktsideSettings${localeId}`;
  const produktsideKortFortaltId = `produktsideKortFortalt${localeId}`;

  useEffect(() => {
    if (!timestamp) {
      return;
    }

    (async function () {
      async function fetchHistoryApi<T>(requestId: string | string[]) {
        const historyResponse = await fetch(`${basePath}/api/history?requestId=${requestId}&time=${timestamp}`);
        const historyData = await historyResponse.json();

        return historyData as HistorikkResponse<T>;
      }

      const produktsideSettingsData = await fetchHistoryApi<HistoryProduktsideSettings>(produktsideSettingsId);
      const produktsideKortFortaltData = await fetchHistoryApi<HistoryProduktsideKortFortalt>(produktsideKortFortaltId);

      // TODO: Fiks typescript
      // @ts-ignore
      const produktsideSectionDocumentIds = produktsideSettingsData?.documents?.[0]?.content?.map(
        // @ts-ignore
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
  }, [basePath, timestamp]);

  return historyData;
}
