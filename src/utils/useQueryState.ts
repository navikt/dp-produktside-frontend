import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

export function useQueryState(initialState = {}) {
  const router = useRouter();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(router.query);
  }, [router.query]);

  const setQueryParams = (query = {}) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return [state, setQueryParams] as [ParsedUrlQuery, (query?: {}) => void];
}
