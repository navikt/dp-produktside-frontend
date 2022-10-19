import { ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import Config from "config";
import { addDays, max, min, subDays } from "date-fns";
import isBefore from "date-fns/isBefore";
import { useEffect, useState } from "react";
import styles from "styles/Historikk.module.scss";
import { getLastElementFromArray } from "utils/arrays";
import { convertTimestampToDate, formatLocaleDate, formatTimestamp } from "utils/dates";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";
import { HistorikkResponse, HistoriskDokument } from "../../sanity/groq/historyFetcher";
import { SectionWithHeader } from "../../components/section-with-header/SectionWithHeader";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { PortableText } from "@portabletext/react";

interface Props {
  revisionsProduktsideSettings: Revision[];
}

const produktsideSettingsId = "produktsideSettings";
const produktsideKortFortaltId = "produktsideKortFortalt";

export async function getStaticProps() {
  const revisionsProduktsideSettings = await revisionsFetcher(produktsideSettingsId);
  const revisionsProduktsideKortFortalt = await revisionsFetcher(produktsideKortFortaltId);

  return {
    props: { revisionsProduktsideSettings, revisionsProduktsideKortFortalt },
    revalidate: 120,
  };
}

export default function HistorikkIndex({ revisionsProduktsideSettings }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedRevision, setSelectedRevision] = useState<Revision | undefined>(undefined);
  const [kortFortaltData, setKortFortaltData] = useState<HistoriskDokument | undefined>(undefined);
  const [sectionData, setSectionData] = useState<HistoriskDokument[] | undefined>(undefined);

  const [selectedRevisionData, setSelectedRevisionData] = useState<HistoriskDokument | undefined>(undefined);
  const revisionDates = revisionsProduktsideSettings.map(({ timestamp }) => convertTimestampToDate(timestamp));

  // useEffect(() => {
  //   const revisionsBeforeSelectedDate = revisionsProduktsideSettings.filter(({ timestamp }) =>
  //     isBefore(convertTimestampToDate(timestamp), selectedDate)
  //   );
  //   const lastRevision = getLastElementFromArray(revisionsBeforeSelectedDate);
  //   setSelectedRevision(lastRevision);
  // }, [selectedDate]);

  useEffect(() => {
    (async function () {
      if (!selectedDate) {
        return;
      }

      //todo: fix timezone offset for selectedDate
      const timestamp = selectedDate.toISOString();
      console.log(timestamp);

      const produktsideSettingsData = await fetch(
        `${Config.basePath}/api/history?requestId=${produktsideSettingsId}&time=${timestamp}`
      ).then((res) => res.json());

      const produktsideKortFortaltData = await fetch(
        `${Config.basePath}/api/history?requestId=${produktsideKortFortaltId}&time=${timestamp}`
      ).then((res) => res.json());

      const produktsideSectionDocumentIds = produktsideSettingsData?.documents?.[0]?.content?.map(
        (section) => section?.produktsideSection?._ref
      );

      const produktsideSectionData = await fetch(
        `${Config.basePath}/api/history?requestId=${produktsideSectionDocumentIds}&time=${timestamp}`
      ).then((res) => res.json());

      setSelectedRevisionData(produktsideSettingsData?.documents?.[0]);
      setKortFortaltData(produktsideKortFortaltData?.documents?.[0]);
      setSectionData(produktsideSectionData?.documents);

      // console.log(produktsideSettingsData);
      console.log(produktsideSectionData);
    })();
  }, [selectedDate]);

  if (revisionsProduktsideSettings.length <= 0) {
    return <div>her skulle det vært noe historikk :scream:</div>;
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
          fromDate={subDays(min(revisionDates), 1)}
          toDate={addDays(max(revisionDates), 1)}
        />

        <p>{`Valgt dato: ${formatLocaleDate(selectedDate)}`}</p>
      </>

      {kortFortaltData && (
        <SectionWithHeader anchorId={kortFortaltData?.slug?.current} title={kortFortaltData?.title}>
          <p>{`Oppdatert ${kortFortaltData?._updatedAt}`}</p>
          <PortableTextContent value={kortFortaltData?.content} />
        </SectionWithHeader>
      )}

      {selectedRevisionData && (
        <>
          {selectedRevisionData.content?.map((seksjon) => {
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
                <PortableText value={section?.content} />
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
