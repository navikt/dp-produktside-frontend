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

1. Sjekk ut branchen `pdf-export`.
2. Åpne `scripts/screenshot.ts` og sett `FROM` og `TO` til ønsket datointervall.
3. Velg språk du vil eksportere:
   - Norsk: `http://localhost:3000` gir `${BASE_URL}/dagpenger/historikk`
   - Engelsk: `http://localhost:3000/en` gir `${BASE_URL}/dagpenger/historikk`
4. Start applikasjonen lokalt:

```bash
npm run dev
```

5. Åpne en ny terminal og kjør eksport:

```bash
npm run pdf-export
```
