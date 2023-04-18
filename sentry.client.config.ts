import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
/* Sentry ENV can't be set per environment since this code is bundled in with the static resources uploaded to our CDN. 
   The same static bundle is used both by dev and production */
const SENTRY_ENV = "production";

Sentry.init({
  dsn: SENTRY_DSN,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  environment: SENTRY_ENV,
});
