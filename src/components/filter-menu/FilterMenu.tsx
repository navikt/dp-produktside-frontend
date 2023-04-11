import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useSanityContext } from "components/sanity-context/sanity-context";
import { AnalyticsEvents, logAmplitudeEvent } from "utils/amplitude";
import { FilterExplanation } from "./FilterExplanation";

interface Props {
  availableFilters?: string[];
  onChange: (value: any[]) => void;
  selectedFilters: string[];
  legend?: string;
  className?: string;
}

export function FilterMenu({
  className,
  availableFilters = ["arbeidsledig", "permittert"],
  selectedFilters,
  onChange,
  legend,
}: Props) {
  const { getGeneralText } = useSanityContext();

  const arbeidsledigLabel = getGeneralText("filter-menu.unemployed");
  const permittertLabel = getGeneralText("filter-menu.layoff");
  const checkboxLegend = legend ?? getGeneralText("filter-menu.label");

  return (
    <CheckboxGroup
      className={className}
      size="small"
      legend={checkboxLegend}
      onChange={(val: any[]) => {
        onChange(val);
      }}
      value={selectedFilters}
    >
      <Checkbox
        value="arbeidsledig"
        onChange={(event) => {
          logAmplitudeEvent(AnalyticsEvents.FILTER, {
            kategori: checkboxLegend,
            filternavn: arbeidsledigLabel,
            avkrysset: event.target.checked,
          });
        }}
      >
        {arbeidsledigLabel}
      </Checkbox>
      <Checkbox
        value="permittert"
        onChange={(event) => {
          logAmplitudeEvent(AnalyticsEvents.FILTER, {
            kategori: checkboxLegend,
            filternavn: permittertLabel,
            avkrysset: event.target.checked,
          });
        }}
      >
        {permittertLabel}
      </Checkbox>
      <FilterExplanation selectedFilters={selectedFilters} availableFilters={availableFilters} />
    </CheckboxGroup>
  );
}
