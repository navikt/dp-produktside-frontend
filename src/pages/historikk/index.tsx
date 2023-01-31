import { Button, ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import { addDays, endOfDay, isSameDay, isWithinInterval, max, min, subDays } from "date-fns";
import { useCallback } from "react";
import { Error } from "components/error/Error";
import { Header } from "components/header/Header";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery, produktsideSectionIdsQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import { Revision, revisionsFetcher } from "sanity-utils/groq/revisionsFetcher";
import styles from "styles/Historikk.module.scss";
import homeStyles from "styles/Home.module.scss";
import {
  convertTimestampToDate,
  formatLocaleDateAndTime,
  formatTimestampAsLocaleTime,
  isValidDate,
  toISOString,
} from "utils/dates";
import { useHistoryData } from "utils/historikk/useHistoryData";
import { useHistoryGrunnbelop } from "utils/historikk/useHistoryGrunnbelop";
import { useQueryState } from "utils/use-query-state/useQueryState";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import { HistoryProduktsideSection, HistorySectionIds } from "sanity-utils/types";
import dynamic from "next/dynamic";
import { SanityProvider } from "components/sanity-context/sanity-context";

interface Props {
  sanityData: any;
  revisions: Revision[];
}

const produktsideSettingsId = "produktsideSettings";
const produktsideKortFortaltId = "produktsideKortFortalt";

export async function getStaticProps() {
  //TODO: Fiks språk når historikk blir rearbeidet
  const sanityData = await sanityClient.fetch(produktsideQuery, { baseLang: "nb", lang: "nb" });
  const sectionIdsData = await sanityClient.fetch<HistorySectionIds>(produktsideSectionIdsQuery, {
    baseLang: "nb",
    lang: "nb",
  });

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

function HistorikkIndex({ sanityData, revisions }: Props) {
  const revisionDates = revisions.map(({ timestamp }) => convertTimestampToDate(timestamp));
  {
    /* Datoer blir satt til slutten av dagen 
    fordi man ønsker all historikk til slutten av den dagen */
  }
  const fromDate = endOfDay(subDays(min(revisionDates), 1));
  const toDate = endOfDay(addDays(max(revisionDates), 1));

  const [selectedDate, setSelectedDate] = useQueryState("timestamp", {
    parse: (v: string) => new Date(v),
    serialize: (v: Date) => toISOString(v),
  });
  const setSelectedDateShallow = useCallback(
    (date: Date) => {
      setSelectedDate(endOfDay(date), { shallow: true });
    },
    [setSelectedDate]
  );

  const isValidSelectedDate =
    isValidDate(selectedDate) && isWithinInterval(selectedDate, { start: fromDate, end: toDate });

  const selectedTimestamp = isValidSelectedDate ? toISOString(selectedDate!) : undefined;

  useHistoryGrunnbelop(selectedTimestamp);
  const historyData = useHistoryData(selectedTimestamp);
  const { settings, kortFortalt, contentSections } = historyData;

  // TODO: Fiks typescript
  // @ts-ignore
  const settingsSections: HistoryProduktsideSection[] = settings?.content?.map((settingsSection) => {
    const section = contentSections?.find(({ _id }) => _id == settingsSection?.produktsideSection?._ref);

    if (section) {
      return section;
    }
  });

  if (revisions.length <= 0) {
    return <Error />;
  }

  return (
    <SanityProvider sanityData={sanityData}>
      <div className={styles.container}>
        <UNSAFE_DatePicker.Standalone
          selected={selectedDate || undefined}
          onSelect={(date: Date | undefined) => {
            if (date) {
              setSelectedDateShallow(endOfDay(date));
            }
          }}
          dropdownCaption
          fromDate={fromDate}
          toDate={toDate}
        />

        {selectedDate && !isValidSelectedDate && <p>Ugyldig dato</p>}

        {selectedDate && isValidSelectedDate && (
          <>
            <p>{`Valgt dato og tidspunkt: ${formatLocaleDateAndTime(selectedDate!)}`}</p>

            <ReadMore header="Endringer denne dagen" className={styles.readMore}>
              {revisions &&
                revisions
                  ?.filter(({ timestamp }) => isSameDay(convertTimestampToDate(timestamp), selectedDate!))
                  ?.map(({ timestamp }) => (
                    <Button
                      size="small"
                      key={timestamp}
                      className={styles.button}
                      onClick={() => setSelectedDate(convertTimestampToDate(timestamp), { shallow: true })}
                    >{`${formatTimestampAsLocaleTime(timestamp)}`}</Button>
                  ))}
            </ReadMore>

            {settings && kortFortalt && (
              <main className={homeStyles.main}>
                <div className={homeStyles.productPage}>
                  {/* TODO: Fiks sist oppdatert dato for historikk i Header */}
                  <Header title={settings?.title} />

                  <div className={homeStyles.content}>
                    <div className={homeStyles.layoutContainer}>
                      <div className={homeStyles.topRow}>
                        <div className={homeStyles.leftCol}>
                          <LeftMenuSection
                            internalLinks={[
                              { anchorId: kortFortalt?.slug?.current, linkText: kortFortalt?.title },
                              ...(settingsSections?.map(({ title, slug }) => ({
                                anchorId: slug?.current,
                                linkText: title,
                              })) ?? []),
                            ]}
                            supportLinks={settings?.supportLinks}
                            sticky={true}
                          />
                        </div>

                        <div className={homeStyles.mainCol}>
                          <SectionWithHeader anchorId={kortFortalt?.slug?.current} title={kortFortalt?.title}>
                            <p>{`Oppdatert ${formatLocaleDateAndTime(
                              convertTimestampToDate(kortFortalt?._updatedAt)
                            )}`}</p>
                            <PortableTextContent value={kortFortalt?.content} />
                          </SectionWithHeader>

                          {settingsSections?.map(
                            ({ _id, slug, title, iconName, _updatedAt, content }: HistoryProduktsideSection) => (
                              <SectionWithHeader key={_id} anchorId={slug?.current} title={title} iconName={iconName}>
                                <p>{`Oppdatert ${formatLocaleDateAndTime(convertTimestampToDate(_updatedAt))}`}</p>
                                {/* TODO: Håndter generelle tekster og kalkulator for historikk */}
                                <PortableTextContent value={content} />
                              </SectionWithHeader>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            )}
          </>
        )}
      </div>
    </SanityProvider>
  );
}

// TODO: Aktiver ssr og finn en måte å håndtere SSR i Historikk.
// Datepicker og useQueryState er lite ssr-vennlige.
export default dynamic(() => Promise.resolve(HistorikkIndex), {
  ssr: false,
});
