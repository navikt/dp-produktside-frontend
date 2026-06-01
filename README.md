This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Produktområde Arbeid - Produktsside Dagpenger

Produktsside dagpenger rettet mot arbeidsledige og permitterte på www.nav.no/arbeid.
Produktsiden befinner seg på www.nav.no/dagpenger.
Innholdet kan redigeres på https://dagpenger.ekstern.dev.nav.no/sanity/.

## Utvikle lokalt

```
npm i
npm run dev
```

## Kontakt

Spørsmål tilknyttet koden kan rettes mot:

- John Martin Lindseth, john.martin.lindseth@nav.no
- Nattphong Klinjan, nattaphong.klinjan@nav.no

## Eksportere historikken i PDF

- Eksporterte PDF-er vil ligge i /pdf-export-mappen.
- Bokmål-historikk er fra 26.04.2023 til 09.04.2024.
- Engelsk historikk er fra 05.07.2023 til 09.04.2024.

### Hvordan eksporterer du historikk i PDF

- Sjekk ut branchen `pdf-export`
- Installere dependency `npm i`
- Åpne `scripts/screenshot.ts` og sett `FROM` og `TO` til ønsket datointervall.
- Velg språk du vil eksportere:
  - Bokmål: `${BASE_URL}/dagpenger/historikk`
  - Engelsk: `${BASE_URL}/dagpenger/en/historikk`
- Start applikasjonen lokalt: `npm run dev`
- Åpne en ny terminal og kjør eksport: `npm run pdf-export`
