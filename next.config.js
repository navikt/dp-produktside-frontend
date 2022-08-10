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
  async redirects() {
    return [
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
