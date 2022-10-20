import { ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import Config from "config";
import { addDays, max, min, subDays } from "date-fns";
import { useEffect, useState } from "react";
import styles from "styles/Historikk.module.scss";
import { convertTimestampToDate, formatLocaleDate, formatTimestamp, toISOString } from "utils/dates";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";
import {
  HistoryProduktsideKortFortalt,
  HistoryProduktsideSection,
  HistoryProduktsideSettings,
} from "../../sanity/groq/historyFetcher";
import { SectionWithHeader } from "../../components/section-with-header/SectionWithHeader";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { PortableText } from "@portabletext/react";
import Error from "components/error/Error";
import { sanityClient } from "sanity/client";
import { produktsideQuery } from "sanity/groq/produktside/produktsideQuery";
import { GrunnbelopData, useGrunnbelopContext } from "components/grunnbelop-context/grunnbelop-context";

interface Props {
  revisionsProduktsideSettings: Revision[];
}

const produktsideSettingsId = "produktsideSettings";
const produktsideKortFortaltId = "produktsideKortFortalt";

export async function getStaticProps() {
  const revisionsProduktsideSettings = await revisionsFetcher(produktsideSettingsId);
  const revisionsProduktsideKortFortalt = await revisionsFetcher(produktsideKortFortaltId);
  const sanityData = await sanityClient.fetch(produktsideQuery);

  return {
    props: { sanityData, revisionsProduktsideSettings, revisionsProduktsideKortFortalt },
    revalidate: 120,
  };
}

export default function HistorikkIndex({ revisionsProduktsideSettings }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [settingsData, setSettingsData] = useState<HistoryProduktsideSettings | undefined>(undefined);
  const [kortFortaltData, setKortFortaltData] = useState<HistoryProduktsideKortFortalt | undefined>(undefined);
  const [sectionData, setSectionData] = useState<HistoryProduktsideSection[] | undefined>(undefined);
  const { G, setGValue } = useGrunnbelopContext();

  const revisionDates = revisionsProduktsideSettings.map(({ timestamp }) => convertTimestampToDate(timestamp));

  useEffect(() => {
    (async function () {
      if (!selectedDate) {
        return;
      }

      //todo: fix timezone offset for selectedDate
      const timestamp = toISOString(selectedDate);

      const grunnbelopResponse = await fetch(`https://g.nav.no/api/v1/grunnbeloep?dato=${timestamp}`);
      const grunnbelopData: GrunnbelopData = await grunnbelopResponse.json();
      setGValue(grunnbelopData?.grunnbeloep);

      console.log(timestamp);
      const historyApi = (requestId: string | string[]) =>
        `${Config.basePath}/api/history?requestId=${requestId}&time=${timestamp}`;

      const produktsideSettingsData = await fetch(historyApi(produktsideSettingsId)).then((res) => res.json());

      const produktsideKortFortaltData = await fetch(historyApi(produktsideKortFortaltId)).then((res) => res.json());

      const produktsideSectionDocumentIds = produktsideSettingsData?.documents?.[0]?.content?.map(
        (section) => section?.produktsideSection?._ref
      );

      const produktsideSectionData = await fetch(historyApi(produktsideSectionDocumentIds)).then((res) => res.json());

      setSettingsData(produktsideSettingsData?.documents?.[0]);
      setKortFortaltData(produktsideKortFortaltData?.documents?.[0]);
      setSectionData(produktsideSectionData?.documents);

      console.log(produktsideSettingsData);
      console.log(produktsideKortFortaltData);
      console.log(produktsideSectionData);
    })();
  }, [selectedDate]);

  if (!revisionsProduktsideSettings.length) {
    return <Error />;
  }

  return (
    <div className={styles.container}>
      <>
        <UNSAFE_DatePicker.Standalone
          onSelect={(date: Date | undefined) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          dropdownCaption
          // fromDate={subDays(min(revisionDates), 1)}
          // toDate={addDays(max(revisionDates), 1)}
          fromDate={new Date(2021, 1, 1)}
          toDate={new Date()}
        />

        <p>{`Valgt dato: ${formatLocaleDate(selectedDate)}`}</p>
      </>

      {kortFortaltData && (
        <SectionWithHeader anchorId={kortFortaltData?.slug?.current} title={kortFortaltData?.title}>
          <p>{`Oppdatert ${kortFortaltData?._updatedAt}`}</p>
          <PortableTextContent value={kortFortaltData?.content} />
        </SectionWithHeader>
      )}

      {settingsData && (
        <>
          {settingsData.content?.map((seksjon) => {
            const section = sectionData?.find(({ _id }) => _id == seksjon?.produktsideSection?._ref);

            if (!section) {
              return null;
            }

            return (
              <SectionWithHeader
                key={section?._id}
                anchorId={section?.slug?.current}
                title={section?.title}
                iconName={section?.iconName}
              >
                <p>{`Oppdatert ${section?._updatedAt}`}</p>
                {/* TODO: Håndter generelle tekster og kalkulator for historikk */}
                <PortableTextContent value={section?.content} />
              </SectionWithHeader>
            );
          })}
        </>
      )}

      <ReadMore header="Debug revisions">
        {revisionsProduktsideSettings?.map(({ id, timestamp }) => (
          <p key={id}>{`${formatTimestamp(timestamp)}`}</p>
        ))}
      </ReadMore>
    </div>
  );
}
