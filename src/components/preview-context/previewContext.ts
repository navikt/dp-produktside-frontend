import { createReducerContext } from "react-use";
import { sanityConfig } from "sanity/client";

const initState = {
  previewMode: false,
  showDrafts: false,
  dataset: sanityConfig.dataset,
  devBanner: false,
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
