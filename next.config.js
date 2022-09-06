const csp = require("./csp");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/dagpenger",
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  async headers() {
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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dagpenger",
        permanent: true,
        basePath: false,
      },
      {
        source: "/dagpenger/(.*)",
        destination: "https://www.nav.no/404",
        permanent: true,
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
