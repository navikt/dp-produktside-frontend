import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface FilterContextProviderProps {
  children: ReactNode;
}

interface FilterContextContextValues {
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
}

const FilterContext = createContext<FilterContextContextValues | undefined>(undefined);

export function FilterContextProvider({ children }: FilterContextProviderProps) {
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <FilterContext.Provider
      value={{
        selectedFilters,
        setSelectedFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterContextProvider");
  }
  return context;
}
