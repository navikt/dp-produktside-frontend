const customJestConfig = {
  collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", ".+test.utils+"], // For å hindre next i å kompilere test-hjelpefiler må vi legge til .test. i filnavn, men da prøver jest å kjøre filene og feiler fordi den ikke finner tester der. Legger derfor til .utils. i filnavn, og ignorerer dette i jest-config. Alt dette for å slippe å installere dev-deps i pipeline
  transform: {
    "^.+\\.(css|less)$": "jest-transform-stub",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // testing library jest-dom needs to be injected for some reason, even after we set jsdom as enviroment
  transformIgnorePatterns: ["/node_modules/(?!(nav-.+)/)", "^.+\\.module\\.(css|sass|scss)$"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss|less)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transform-stub",
    "@navikt/ds-react(.*)": "@navikt/ds-react/cjs$1",
    "@navikt/ds-icons(.*)": "@navikt/ds-icons/cjs$1",
    uuid: require.resolve("uuid"), // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
  },
  testEnvironment: "jsdom",
};

// jest.config.js
const nextJest = require("next/jest");

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: "src" });

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig);
