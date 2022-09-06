const csp = {
  "default-src": ["'self'", "tjenester.nav.no", "appres.nav.no"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "appres.nav.no",
    "static.hotjar.com",
    "script.hotjar.com",
    "*.psplugin.com",
    "*.nav.no",
    "in2.taskanalytics.com",
  ],
  "style-src": [
    "'self'",
    "blob:",
    "*.nav.no",
    "arbeid.dev.nav.no",
    "appres.nav.no",
    "'unsafe-inline'",
    "fonts.googleapis.com",
  ],
  "connect-src": [
    "'self'",
    "*.nav.no",
    "appres.nav.no",
    "amplitude.nav.no/collect",
    "*.psplugin.com",
    "*.hotjar.com",
    "*.vc.hotjar.com",
    "*.vc.hotjar.io:*",
    "*.surveystats.hotjar.io",
    "api.puzzel.com",
    "nav.boost.ai",
    "rt6o382n.api.sanity.io",
    "ta-survey-v2.herokuapp.com",
    "in2.taskanalytics.com",
  ],
  "font-src": ["'self'", "data:", "*.psplugin.com", "*.hotjar.com", "fonts.gstatic.com"],
  "frame-src": ["'self'", "vars.hotjar.com"],
  "img-src": ["'self'", "*.hotjar.com", "*.nav.no", "data:"],
};

const stringified = Object.entries(csp)
  .map((entry) => `${entry[0]} ${entry[1].join(" ")}`)
  .join("; ");

module.exports = stringified;
