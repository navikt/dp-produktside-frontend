const { withSentryConfig } = require("@sentry/nextjs");
const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const path = require("path");

// TODO: Denne bør deles med _document.tsx
const supportedLocales = ["nb", "en"];

// Direktiver appen vår benytter
const myAppDirectives = {
  "script-src-elem": ["'self'"],
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'", "rt6o382n.api.sanity.io", "rt6o382n.apicdn.sanity.io", "amplitude.nav.no/collect"],
  "report-uri": "https://sentry.gc.nav.no/api/162/security/?sentry_key=209db408152a436fa73a237b1bf29182",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.ASSET_PREFIX,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  i18n: {
    locales: supportedLocales,
    defaultLocale: "nb",
    localeDetection: false,
  },
  output: "standalone",
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  swcMinify: true,
  async headers() {
    const env = process.env.DECORATOR_ENV || "prod";
    const csp = await buildCspHeader(myAppDirectives, { env });
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  errorHandler: (err, invokeErr, compilation) => {
    compilation.warnings.push("Sentry CLI Plugin: " + err.message);
  },
});
