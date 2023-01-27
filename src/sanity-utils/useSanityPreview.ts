import { createPreviewSubscriptionHook } from "next-sanity";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { usePreviewContext } from "components/preview-context/previewContext";
import { sanityConfig } from "./client";

export function useSanityPreview<Data>(initialData: Data, query: string, params?: Record<string, any>): Data {
  const router = useRouter();
  const [context, dispatch] = usePreviewContext();
  const enablePreview = router.query.preview === "true" || context.previewMode;
  const dataset = (router.query.dataset as string) || context.dataset;

  useEffect(() => {
    enablePreview && dispatch({ previewMode: true, dataset: dataset, showDrafts: true });
  }, [enablePreview, dataset, dispatch]);

  const usePreviewSubscription = useMemo(() => createPreviewSubscriptionHook({ ...sanityConfig, dataset }), [dataset]);

  const { data: previewData, error } = usePreviewSubscription(query, {
    params,
    initialData,
    enabled: enablePreview,
  });

  if (error) {
    console.error(error);
  }

  return context.showDrafts ? previewData : initialData;
}
