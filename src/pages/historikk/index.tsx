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

interface Props {
  revisions: Revision[];
}

const produktsideId = "produktsideSettings";

export async function getStaticProps() {
  const revisions = await revisionsFetcher(produktsideId);

  return {
    props: { revisions },
    revalidate: 120,
  };
}

export default function HistorikkIndex({ revisions }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRevision, setSelectedRevision] = useState<Revision | undefined>(undefined);
  const [selectedRevisionData, setSelectedRevisionData] = useState<HistoriskDokument | undefined>(undefined);
  const revisionDates = revisions.map(({ timestamp }) => convertTimestampToDate(timestamp));

  useEffect(() => {
    const revisionsBeforeSelectedDate = revisions.filter(({ timestamp }) =>
      isBefore(convertTimestampToDate(timestamp), selectedDate)
    );
    const lastRevision = getLastElementFromArray(revisionsBeforeSelectedDate);
    setSelectedRevision(lastRevision);
  }, [selectedDate]);

  useEffect(() => {
    (async function () {
      if (!selectedRevision) {
        return;
      }
      const revision = await fetch(
        `${Config.basePath}/api/history?requestId=${produktsideId}&revisionId=${selectedRevision.id}`
      ).then((res) => res.json());
      setSelectedRevisionData(revision?.documents?.[0]);
      console.log(revision);
    })();
  }, [selectedRevision]);
  if (revisions.length <= 0) {
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

      {selectedRevision && <p>{`Valgt revision: ${formatTimestamp(selectedRevision?.timestamp)}`}</p>}
      {selectedRevisionData && (
        <>
          <section>
            <>
              Hei var det:
              <SectionWithHeader anchorId="kortfortalt" title="kortfortalt">
                lenke til kort fortalt seksjon
              </SectionWithHeader>
              {selectedRevisionData.content?.map((seksjon) => (
                <SectionWithHeader
                  key={seksjon?.produktsideSection._ref}
                  anchorId="enseksjon"
                  title={seksjon?.produktsideSection._ref}
                >
                  lenke til innholdsseksjon
                </SectionWithHeader>
              ))}
            </>
          </section>
        </>
      )}

      <ReadMore header="Debug revisions">
        {revisions?.map(({ id, timestamp }) => (
          <p key={id}>{`${formatTimestamp(timestamp)}`}</p>
        ))}
      </ReadMore>
    </div>
  );
}
