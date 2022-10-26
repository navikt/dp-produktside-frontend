import { Button, ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import { addDays, isSameDay, max, min, startOfDay, subDays } from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Error } from "components/error/Error";
import { Header } from "components/header/Header";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { sanityClient } from "sanity/client";
import { produktsideQuery, produktsideSectionIdsQuery } from "sanity/groq/produktside/produktsideQuery";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";
import styles from "styles/Historikk.module.scss";
import homeStyles from "styles/Home.module.scss";
import {
  convertTimestampToDate,
  dateIsValidAndWithinRange,
  formatLocaleDate,
  formatTimestamp,
  toISOString,
} from "utils/dates";
import { useHistoryData } from "utils/historikk/useHistoryData";
import { useHistoryGrunnbelop } from "utils/historikk/useHistoryGrunnbelop";
import { useIsFirstRender } from "utils/useIsFirstRender";
import { useQueryState } from "utils/use-query-state/useQueryState";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";

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
  const [selectedDate, setSelectedDate] = useQueryState("timestamp", {
    parse: (v: string) => new Date(v),
    serialize: (v: Date) => toISOString(v),
  });
  const setSelectedDateShallow = (date: Date) => setSelectedDate(startOfDay(date), { shallow: true });

  // brukes for å unngå hydration problemer
  const isFirstRender = useIsFirstRender();
  const revisionDates = revisions.map(({ timestamp }) => convertTimestampToDate(timestamp));
  const router = useRouter();
  const fromDate = subDays(min(revisionDates), 1);
  const toDate = addDays(max(revisionDates), 1);
  const isValidDate = dateIsValidAndWithinRange(selectedDate ?? undefined, { start: fromDate, end: toDate });
  const selectedTimestamp = isValidDate ? toISOString(selectedDate as Date) : undefined;

  const historyData = useHistoryData(selectedTimestamp);
  const { settings, kortFortalt, contentSections } = historyData;
  useHistoryGrunnbelop(selectedTimestamp);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!isValidDate) {
      setSelectedDateShallow(toDate);
    }
  }, [selectedDate, isValidDate, toDate, router.isReady]);

  if (revisions.length <= 0) {
    return <Error />;
  }

  const settingsSections = settings?.content?.map((settingsSection) => {
    const section = contentSections?.find(({ _id }) => _id == settingsSection?.produktsideSection?._ref);

    return section ? section : null;
  });

  return (
    <div className={styles.container}>
      <UNSAFE_DatePicker.Standalone
        selected={isFirstRender ? undefined : selectedDate}
        onSelect={(date: Date | undefined) => {
          if (date) {
            setSelectedDateShallow(date);
          }
        }}
        dropdownCaption
        fromDate={fromDate}
        toDate={toDate}
      />

      {!isFirstRender && <p>{`Valgt dato: ${isValidDate ? formatLocaleDate(selectedDate) : "Ugyldig dato"}`}</p>}

      {!isFirstRender && (
        <ReadMore header="Endringer denne dagen" className={styles.readMore}>
          {revisions &&
            revisions
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
      )}

      <main className={homeStyles.main}>
        <div className={homeStyles.productPage}>
          {settings && <Header title={settings?.title} lastUpdated={settings?._updatedAt} />}

          <div className={homeStyles.content}>
            <div className={homeStyles.layoutContainer}>
              <div className={homeStyles.topRow}>
                <div className={homeStyles.leftCol}>
                  {settingsSections && kortFortalt && (
                    <LeftMenuSection
                      menuHeader="Innhold"
                      internalLinks={[
                        { anchorId: kortFortalt?.slug?.current, linkText: kortFortalt?.title },
                        ...settingsSections?.map(({ title, slug }) => ({ anchorId: slug?.current, linkText: title })),
                      ]}
                      supportLinks={settings?.supportLinks}
                      sticky={true}
                    />
                  )}
                </div>

                <div className={homeStyles.mainCol}>
                  {kortFortalt && (
                    <SectionWithHeader anchorId={kortFortalt?.slug?.current} title={kortFortalt?.title}>
                      <p>{`Oppdatert ${kortFortalt?._updatedAt}`}</p>
                      <PortableTextContent value={kortFortalt?.content} />
                    </SectionWithHeader>
                  )}

                  {settings &&
                    settingsSections?.map((settingsSection) => (
                      <SectionWithHeader
                        key={settingsSection?._id}
                        anchorId={settingsSection?.slug?.current}
                        title={settingsSection?.title}
                        iconName={settingsSection?.iconName}
                      >
                        <p>{`Oppdatert ${settingsSection?._updatedAt}`}</p>
                        {/* TODO: Håndter generelle tekster og kalkulator for historikk */}
                        <PortableTextContent value={settingsSection?.content} />
                      </SectionWithHeader>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
