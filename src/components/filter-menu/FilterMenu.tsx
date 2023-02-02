import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useSanityContext } from "components/sanity-context/sanity-context";
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

  return (
    <CheckboxGroup
      className={className}
      size="small"
      legend={legend ?? getGeneralText("filter-menu.label")}
      onChange={(val: any[]) => {
        onChange(val);
      }}
      value={selectedFilters}
    >
      <Checkbox value="arbeidsledig">{getGeneralText("filter-menu.unemployed")}</Checkbox>
      <Checkbox value="permittert">{getGeneralText("filter-menu.layoff")}</Checkbox>
      <FilterExplanation selectedFilters={selectedFilters} availableFilters={availableFilters} />
    </CheckboxGroup>
  );
}
