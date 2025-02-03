const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const path = require("path");

// TODO: Denne bør deles med _document.tsx
const supportedLocales = ["nb", "en"];

// Direktiver appen vår benytter
const myAppDirectives = {
  "script-src-elem": ["'self'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'", "fonts.googleapis.com"],
  "style-src-elem": ["fonts.googleapis.com"],
  "connect-src": ["'self'", "rt6o382n.api.sanity.io", "rt6o382n.apicdn.sanity.io", "amplitude.nav.no/collect"],
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

module.exports = withBundleAnalyzer(nextConfig);
