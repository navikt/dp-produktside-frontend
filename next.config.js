const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const path = require("path");

// Direktiver appen vår benytter
const myAppDirectives = {
  "script-src-elem": ["'self'"],
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'", "rt6o382n.api.sanity.io", "rt6o382n.apicdn.sanity.io"],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.ASSET_PREFIX,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/dagpenger",
  productionBrowserSourceMaps: true,
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
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

module.exports = nextConfig;
