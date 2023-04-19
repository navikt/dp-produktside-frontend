import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
/* Sentry ENV can't be set per environment since this code is bundled in with the static resources uploaded to our CDN. 
   The same static bundle is used both by dev and production */
const SENTRY_ENV = "production";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  environment: SENTRY_ENV,
});
