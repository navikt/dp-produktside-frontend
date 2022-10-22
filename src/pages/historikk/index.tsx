import { Button, ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import Error from "components/error/Error";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { addDays, max, min, subDays } from "date-fns";
import isSameDay from "date-fns/isSameDay";
import router from "next/router";
import { useEffect } from "react";
import { sanityClient } from "sanity/client";
import { produktsideQuery, produktsideSectionIdsQuery } from "sanity/groq/produktside/produktsideQuery";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";
import styles from "styles/Historikk.module.scss";
import { createBigIntLiteral } from "typescript";
import {
  convertTimestampToDate,
  formatLocaleDate,
  formatLocaleDateAndTime,
  formatTimestamp,
  toISOString,
} from "utils/dates";
import { useHistoryData } from "utils/historikk/useHistoryData";
import { useHistoryGrunnbelop } from "utils/historikk/useHistoryGrunnbelop";
import { useQueryState } from "utils/useQueryState";
import { SectionWithHeader } from "../../components/section-with-header/SectionWithHeader";
interface Props {
  revisions: Revision[];
}

const produktsideSettingsId = "produktsideSettings";
const produktsideKortFortaltId = "produktsideKortFortalt";

export async function getStaticProps() {
  const sanityData = await sanityClient.fetch(produktsideQuery);
  const sectionIdsData = await sanityClient.fetch(produktsideSectionIdsQuery);
  const sectionIdsArray = sectionIdsData.sectionIds.map(({ _id }) => _id);
  const revisionsProduktsideSettings = await revisionsFetcher(produktsideSettingsId);
  const revisionsProduktsideKortFortalt = await revisionsFetcher(produktsideKortFortaltId);
  const revisionsProduktsideSection = await revisionsFetcher(sectionIdsArray);

  const revisions = [
    ...revisionsProduktsideSettings,
    ...revisionsProduktsideKortFortalt,
    ...revisionsProduktsideSection,
  ];

  return {
    props: { sanityData, revisions },
    revalidate: 120,
  };
}

export default function HistorikkIndex({ revisions }: Props) {
  // const [selectedTime, setSelectedTime] = useState(toISOString(new Date()));
  const initialTime = toISOString(new Date());
  const [query, setQueryParams] = useQueryState({ time: initialTime });
  const selectedTime = query?.time as string;
  const setSelectedTime = (time: string) => setQueryParams({ time: time });
  const selectedDate = convertTimestampToDate(selectedTime);

  const revisionDates = revisions.map(({ timestamp }) => convertTimestampToDate(timestamp));
  const { settings, kortFortalt, contentSections } = useHistoryData(selectedTime);
  useHistoryGrunnbelop(selectedTime);
  console.log(settings, kortFortalt, contentSections);

  if (!revisions.length) {
    return <Error />;
  }

  return (
    <div className={styles.container}>
      <UNSAFE_DatePicker.Standalone
        // selected={selectedDate}
        onSelect={(date: Date | undefined) => {
          if (date) {
            setSelectedTime(toISOString(date));
          }
        }}
        dropdownCaption
        fromDate={subDays(min(revisionDates), 1)}
        toDate={addDays(max(revisionDates), 1)}
      />

      {/* <p>{`Valgt dato: ${formatLocaleDateAndTime(convertTimestampToDate(selectedTime))}`}</p> */}

      <ReadMore header="Endringer denne dagen" className={styles.readMore}>
        {revisions
          ?.filter(({ timestamp }) => isSameDay(convertTimestampToDate(timestamp), selectedDate))
          ?.map(({ timestamp }) => (
            <Button
              size="small"
              key={timestamp}
              className={styles.button}
              onClick={() => setSelectedTime(timestamp)}
            >{`${formatTimestamp(timestamp)}`}</Button>
          ))}
      </ReadMore>

      {kortFortalt && (
        <SectionWithHeader anchorId={kortFortalt?.slug?.current} title={kortFortalt?.title}>
          <p>{`Oppdatert ${kortFortalt?._updatedAt}`}</p>
          <PortableTextContent value={kortFortalt?.content} />
        </SectionWithHeader>
      )}

      {settings?.content?.map((settingsSection) => {
        const section = contentSections?.find(({ _id }) => _id == settingsSection?.produktsideSection?._ref);

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
    </div>
  );
}
