import { useEffect, useState } from "react";

export function useDebouncedValue<T>(input: T, delay: number): T {
  const [value, setValue] = useState(input);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(input);
    }, delay);
    return () => clearTimeout(timeout);
  }, [input, delay]);

  return value;
}
