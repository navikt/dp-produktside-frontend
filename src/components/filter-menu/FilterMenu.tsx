import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useSanityContext } from "contexts/sanity-context/SanityContext";
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
      <Checkbox value="arbeidsledig">{arbeidsledigLabel}</Checkbox>
      <Checkbox value="permittert">{permittertLabel}</Checkbox>
      <FilterExplanation selectedFilters={selectedFilters} availableFilters={availableFilters} />
    </CheckboxGroup>
  );
}
