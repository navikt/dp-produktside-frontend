import { ReadMore, UNSAFE_DatePicker } from "@navikt/ds-react";
import Config from "config";
import { addDays, max, min, subDays } from "date-fns";
import isBefore from "date-fns/isBefore";
import { useEffect, useState } from "react";
import styles from "styles/Historikk.module.scss";
import { getLastElementFromArray } from "utils/arrays";
import { convertTimestampToDate, formatLocaleDate, formatTimestamp } from "utils/dates";
import { Revision, revisionsFetcher } from "sanity/groq/revisionsFetcher";

interface Props {
  revisions: Revision[];
}

const requestId = "produktsideSettings";

export async function getStaticProps() {
  const revisions = await revisionsFetcher(requestId);

  return {
    props: { revisions },
    revalidate: 120,
  };
}

export default function HistorikkIndex({ revisions }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRevision, setSelectedRevision] = useState<Revision | undefined>(undefined);
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
        `${Config.basePath}/api/history?requestId=${requestId}&revisionId=${selectedRevision.id}`
      ).then((res) => res.json());

      console.log(revision);
    })();
  }, [selectedRevision]);

  return (
    <div className={styles.container}>
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

      {selectedRevision && <p>{`Valgt revision: ${formatTimestamp(selectedRevision?.timestamp)}`}</p>}

      <ReadMore header="Debug revisions">
        {revisions?.map(({ id, timestamp }) => (
          <p key={id}>{`${formatTimestamp(timestamp)}`}</p>
        ))}
      </ReadMore>
    </div>
  );
}
