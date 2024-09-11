import { BodyLong, Button, DatePicker, Heading, Loader, Select, useDatepicker } from "@navikt/ds-react";
import { Header } from "components/header/Header";
import { LeftMenuSection } from "components/layout/left-menu-section/LeftMenuSection";
import { PortableTextContent } from "components/portable-text-content/PortableTextContent";
import { SectionWithHeader } from "components/section-with-header/SectionWithHeader";
import { useGrunnbelopContext } from "contexts/grunnbelop-context/GrunnbelopContext";
import { isSameDay, startOfDay } from "date-fns";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { sanityClient } from "sanity-utils/client";
import { produktsideQuery, produktsideSectionIdsQuery } from "sanity-utils/groq/produktside/produktsideQuery";
import { Revision, revisionsFetcher } from "sanity-utils/groq/revisionsFetcher";
import { HistoryProduktsideSection, HistorySectionIds } from "sanity-utils/types";
import styles from "styles/Historikk.module.scss";
import homeStyles from "styles/Home.module.scss";
import { convertTimestampToDate, formatLocaleDateAndTime, formatTimestampAsLocaleTime, toISOString } from "utils/dates";
import { HistoryData, fetchHistoryData } from "utils/historikk/fetchHistoryData";
import { fetchHistoryGrunnbelop } from "utils/historikk/fetchHistoryGrunnbelop";

interface Props {
  sanityData: any;
  revisions: Revision[];
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const lang = locale ?? "nb";

  const sanityData = await sanityClient.fetch(produktsideQuery, { lang: lang });
  const sectionIdsData = await sanityClient.fetch<HistorySectionIds>(produktsideSectionIdsQuery, {
    lang: lang,
  });

  const sectionIdsArray = sectionIdsData.sectionIds.map(({ _id }) => _id);
  const revisionsProduktsideSettings = await revisionsFetcher("produktsideSettingsId");
  const revisionsProduktsideKortFortalt = await revisionsFetcher("produktsideKortFortaltId");
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
  const { basePath, locale, replace } = useRouter();
  const { setGValue } = useGrunnbelopContext();
  const [loading, setLoading] = useState(false);
  const [dateValidationError, setDateValidationError] = useState("");
  const [selectedTimestamp, setSelectedTimestamp] = useState("");
  const [historyData, setHistoryData] = useState<HistoryData | undefined>(undefined);
  const fromDate = locale === "en" ? new Date(2023, 6, 5) : new Date(2023, 3, 26);
  const toDate = new Date();

  const { datepickerProps, inputProps, selectedDay } = useDatepicker({
    fromDate,
    toDate,
    onDateChange: () => {
      setSelectedTimestamp("");
      setHistoryData(undefined);
    },
    onValidate: (val) => {
      setDateValidationError(!val.isValidDate ? "Valgt dato er ugyldig" : "");
    },
  });

  const isValidSelectedDay = selectedDay && !dateValidationError;
  const defaultSelectedTimestamp = isValidSelectedDay ? toISOString(startOfDay(selectedDay as Date)) : "";

  const revisionsOnSelectedDay = selectedDay
    ? revisions?.filter(({ timestamp }) => isSameDay(convertTimestampToDate(timestamp), selectedDay))
    : [];
  const hasRevisionsOnSelectedDay = revisionsOnSelectedDay.length > 0;

  // TODO: Fiks typescript
  // @ts-ignore
  const settingsSections: HistoryProduktsideSection[] = historyData
    ? // @ts-ignore
      historyData?.settings?.content?.map((settingsSection) => {
        // @ts-ignore
        const section = historyData?.contentSections?.find(
          ({ _id }) => _id == settingsSection?.produktsideSection?._ref,
        );

        if (section) {
          return section;
        }
      })
    : [];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    replace("/historikk", undefined, { shallow: true });
    const newHistoryData = await fetchHistoryData({ basePath, timestamp: selectedTimestamp });
    const historyGrunnbelop = await fetchHistoryGrunnbelop(selectedTimestamp);

    setHistoryData(newHistoryData);
    setGValue(historyGrunnbelop.grunnbeloep);
    setLoading(false);
  }

  useEffect(() => {
    if (!hasRevisionsOnSelectedDay) {
      setSelectedTimestamp(defaultSelectedTimestamp);
    }
  }, [selectedDay]);

  return (
    <div className={styles.container}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <form onSubmit={onSubmit}>
        <fieldset className={styles.fieldset}>
          <Heading level="1" size="xlarge" className={styles.title}>
            Historikk
          </Heading>

          <BodyLong className={styles.description}>
            Her finner du historiske versjoner av den <strong>{locale === "en" ? "engelske" : "norske"}</strong> siden
            om dagpenger. Velg dato og klokkeslett for å se innholdet du ønsker.
          </BodyLong>

          <DatePicker {...datepickerProps} className={styles.datepicker}>
            <DatePicker.Input {...inputProps} label="Velg dato" error={dateValidationError ?? undefined} />
          </DatePicker>

          {isValidSelectedDay && (
            <>
              <Select
                className={styles.select}
                label="Velg klokkeslett"
                description={
                  hasRevisionsOnSelectedDay
                    ? "Se alle publiseringstidspunktene for denne dagen."
                    : "Det er ikke publisert noen versjoner på dagen du har valgt. Derfor kan du ikke velge andre tidspunkter."
                }
                onChange={(event) => {
                  setHistoryData(undefined);
                  setSelectedTimestamp(event.target.value);
                }}
                value={selectedTimestamp}
              >
                {!hasRevisionsOnSelectedDay && (
                  <option key={defaultSelectedTimestamp} value={defaultSelectedTimestamp}>
                    {formatTimestampAsLocaleTime(defaultSelectedTimestamp)}
                  </option>
                )}
                {hasRevisionsOnSelectedDay && <option value="">Velg tidspunkt</option>}
                {revisionsOnSelectedDay?.map(({ timestamp }) => (
                  <option key={timestamp} value={timestamp}>{`${formatTimestampAsLocaleTime(timestamp)}`}</option>
                ))}
              </Select>

              {selectedTimestamp && (
                <Button loading={loading} type="submit" className={styles.button}>
                  Vis innhold
                </Button>
              )}

              {historyData && selectedTimestamp && (
                <Heading
                  className={styles.selectedTimestampText}
                  size="small"
                  as="p"
                >{`Viser innhold for: ${formatLocaleDateAndTime(convertTimestampToDate(selectedTimestamp))}`}</Heading>
              )}
            </>
          )}
        </fieldset>
      </form>

      {loading && <Loader size="3xlarge" title="Laster inn..." />}

      {!loading && selectedTimestamp && historyData?.kortFortalt && historyData?.settings && (
        <>
          <main className={homeStyles.main}>
            <div className={homeStyles.productPage}>
              {/* TODO: Fiks historikk for Header-skjema */}
              <Header title="Dagpenger" leftSubtitle="PENGESTØTTE" rightSubtitle="Oppdatert" />

              <div className={homeStyles.content}>
                <div className={homeStyles.layoutContainer}>
                  <div className={homeStyles.topRow}>
                    <div className={homeStyles.leftCol}>
                      <LeftMenuSection
                        title={historyData?.settings?.title}
                        internalLinks={[
                          {
                            anchorId: historyData?.kortFortalt?.slug?.current ?? "",
                            linkText: historyData?.kortFortalt?.title ?? "",
                          },
                          ...(settingsSections?.map(({ title, slug }) => ({
                            anchorId: slug?.current,
                            linkText: title,
                          })) ?? []),
                        ]}
                        supportLinksTitle={historyData.settings?.supportLinksTitle}
                        supportLinks={historyData.settings?.supportLinks}
                        sticky={true}
                      />
                    </div>

                    <div className={homeStyles.mainCol}>
                      <SectionWithHeader
                        anchorId={historyData?.kortFortalt?.slug?.current}
                        title={historyData?.kortFortalt?.title}
                      >
                        <p>{`Oppdatert ${formatLocaleDateAndTime(
                          convertTimestampToDate(historyData?.kortFortalt?._updatedAt),
                        )}`}</p>
                        <PortableTextContent value={historyData?.kortFortalt?.content!} />
                      </SectionWithHeader>

                      {settingsSections?.map(
                        ({ _id, slug, title, iconName, _updatedAt, content }: HistoryProduktsideSection) => (
                          <SectionWithHeader key={_id} anchorId={slug?.current} title={title} iconName={iconName}>
                            <p>{`Oppdatert ${formatLocaleDateAndTime(convertTimestampToDate(_updatedAt))}`}</p>
                            {/* TODO: Håndter generelle tekster og kalkulator for historikk */}
                            <PortableTextContent value={content} />
                          </SectionWithHeader>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
