import { createReducerContext } from "react-use";
import { sanityConfig } from "sanity-utils/client";

const initState = {
  previewMode: false,
  showDrafts: false,
  dataset: sanityConfig.dataset,
};

type State = typeof initState;
type Action = Partial<State>;

function reducer(state: State, action: Action) {
  return {
    ...state,
    ...action,
  };
}

const [useContext, Provider] = createReducerContext(reducer, initState);

export const PreviewContextProvider = Provider;
export const usePreviewContext = useContext;
