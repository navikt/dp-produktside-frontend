import { logAmplitudeEvent as logAmplitudeEventDecorator } from "@navikt/nav-dekoratoren-moduler";

export enum AnalyticsEvents {
  ACC_COLLAPSE = "accordion lukket",
  ACC_EXPAND = "accordion åpnet",
  COPY_LINK = "kopier-lenke",
  FILTER = "filtervalg",
  FORM_SUBMITTED = "skjema fullført",
  NAVIGATION = "navigere",
}

export function logAmplitudeEvent(eventName: AnalyticsEvents, eventData?: Record<string, any>): Promise<any> {
  return logAmplitudeEventDecorator({
    origin: "dp-produktside-frontend",
    eventName,
    eventData,
  }).catch((error) => console.log(`Amplitude: Oh no! ${error}`));
}
