import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { filterTexts } from "./filter-texts";
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
  legend = filterTexts.whatIsYourSituation,
}: Props) {
  return (
    <CheckboxGroup
      className={className}
      size="small"
      legend={legend}
      onChange={(val: any[]) => {
        onChange(val);
      }}
      value={selectedFilters}
    >
      <Checkbox value="arbeidsledig">Jeg er arbeidsledig</Checkbox>
      <Checkbox value="permittert">Jeg er permittert</Checkbox>
      <FilterExplanation selectedFilters={selectedFilters} availableFilters={availableFilters} />
    </CheckboxGroup>
  );
}

export function HorizontalFilterMenu({ legend = filterTexts.showingInformationFor, ...restProps }: Props) {
  return <FilterMenu legend={legend} {...restProps} />;
}
