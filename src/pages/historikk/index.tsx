import { Button, ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import Error from "components/error/Error";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { addDays, max, min, subDays, isSameDay } from "date-fns";
import { sanityClient } from "sanity/client";
import { produktsideQuery, produktsideSectionIdsQuery } from "sanity/groq/produktside/produktsideQuery";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";
import styles from "styles/Historikk.module.scss";
import { convertTimestampToDate, formatLocaleDate, formatTimestamp, toISOString } from "utils/dates";
import { useHistoryData } from "utils/historikk/useHistoryData";
import { useHistoryGrunnbelop } from "utils/historikk/useHistoryGrunnbelop";
import { SectionWithHeader } from "../../components/section-with-header/SectionWithHeader";
import { useQueryState } from "utils/useQueryState/useQueryState";
import { queryTypes } from "utils/useQueryState/defs";

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
  const [selectedDate, setSelectedDate] = useQueryState("time", queryTypes.isoDateTime.withDefault(new Date()));
  const selectedTimestamp = toISOString(selectedDate);

  const revisionDates = revisions.map(({ timestamp }) => convertTimestampToDate(timestamp));
  const { settings, kortFortalt, contentSections } = useHistoryData(selectedTimestamp);
  useHistoryGrunnbelop(selectedTimestamp);
  console.log(settings, kortFortalt, contentSections);

  if (!revisions.length) {
    return <Error />;
  }

  return (
    <div className={styles.container}>
      <UNSAFE_DatePicker.Standalone
        selected={selectedDate}
        onSelect={(date: Date | undefined) => {
          if (date) {
            setSelectedDate(date, { shallow: true });
          }
        }}
        dropdownCaption
        fromDate={subDays(min(revisionDates), 1)}
        toDate={addDays(max(revisionDates), 1)}
      />

      <p>{`Valgt dato: ${formatLocaleDate(selectedDate)}`}</p>

      <ReadMore header="Endringer denne dagen" className={styles.readMore}>
        {revisions
          ?.filter(({ timestamp }) => isSameDay(convertTimestampToDate(timestamp), selectedDate))
          ?.map(({ timestamp }) => (
            <Button
              size="small"
              key={timestamp}
              className={styles.button}
              onClick={() => setSelectedDate(convertTimestampToDate(timestamp), { shallow: true })}
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
