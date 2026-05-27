import { chromium, Page } from "@playwright/test";
import fs from "fs";

const FROM = "2025-05-27"; // yyyy-mm-dd (inclusive, earlier date)
const TO = "2025-05-27"; // yyyy-mm-dd (inclusive, later date)
const BASE_URL = process.argv[2] ?? "http://localhost:3000";

function parseYYYYMMDD(d: string): Date {
  const [yyyy, mm, dd] = d.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

function toDDMMYYYY(d: Date): string {
  return [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getFullYear()),
  ].join(".");
}

async function savePdf(page: Page, timestamp: string): Promise<string | null> {
  const loader = page.locator('[title="Laster inn..."]');
  await loader.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  await loader.waitFor({ state: "hidden", timeout: 60000 });
  await page.locator("main#maincontent").waitFor({ state: "visible", timeout: 30000 });
  await page.waitForLoadState("networkidle");

  const shownTimestampText = await page
    .getByText(/^Viser innhold for:/)
    .first()
    .textContent();
  const shownTimestamp = shownTimestampText?.replace("Viser innhold for:", "").replace(/\s+/g, " ").trim();

  if (!shownTimestamp) {
    console.error(`  Could not find 'Viser innhold for' text for timestamp ${timestamp}`);
    return null;
  }

  await page.evaluate(() => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = (link as HTMLAnchorElement).getAttribute("href") ?? "";
      const target = document.querySelector(href);
      if (target) target.classList.add("is-anchor-target");
      const span = document.createElement("span");
      span.className = "anchor-ref";
      span.textContent = ` #${href.slice(1)} `;
      link.insertAdjacentElement("afterend", span);
    });
  });

  // shownTimestamp is "DD.MM.YYYY HH:mm" — keep date from text, but use revision timestamp for HH-mm-ss
  const [datePart] = shownTimestamp.split(" ");
  const [dd, mm, yyyy] = datePart.split(".");
  const tsDate = new Date(timestamp);
  const hh = String(tsDate.getHours()).padStart(2, "0");
  const min = String(tsDate.getMinutes()).padStart(2, "0");
  const sec = String(tsDate.getSeconds()).padStart(2, "0");
  const outputDir = `pdf_export/${yyyy}_${mm}`;
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = `${outputDir}/${yyyy}-${mm}-${dd}_${hh}-${min}-${sec}.pdf`;

  await page.pdf({
    path: outputFile,
    format: "A4",
    printBackground: true,
    scale: 0.9,
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
  });

  return outputFile;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });

  const fromDate = parseYYYYMMDD(FROM);
  const toDate = parseYYYYMMDD(TO);
  const dates: string[] = [];
  for (let d = new Date(toDate); d >= fromDate; d.setDate(d.getDate() - 1)) {
    dates.push(toDDMMYYYY(new Date(d)));
  }

  console.log(`Processing ${dates.length} dates: ${FROM} → ${TO}`);

  await page.goto(`${BASE_URL}/dagpenger/historikk`, { waitUntil: "networkidle" });

  for (const date of dates) {
    console.log(`\n── Date: ${date}`);

    const dateInput = page.getByLabel("Velg dato");
    await dateInput.click();
    await dateInput.fill(date);
    await dateInput.press("Tab");

    const timeSelect = page.getByLabel("Velg klokkeslett");
    const appeared = await timeSelect
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (!appeared) {
      console.log(`  No time select appeared — skipping`);
      continue;
    }

    const options = await timeSelect.locator("option").all();
    const allValues = await Promise.all(options.map((o) => o.getAttribute("value")));
    const timestamps = allValues.filter((v) => v && v.length > 0) as string[];

    if (timestamps.length === 0) {
      console.log(`  No options found — skipping`);
      continue;
    }

    console.log(`  Found ${timestamps.length} version(s)`);

    for (const ts of timestamps) {
      await timeSelect.selectOption(ts);
      await page.getByRole("button", { name: "Vis innhold" }).click();

      const saved = await savePdf(page, ts);
      if (saved) console.log(`  Saved: ${saved}`);

      // Return to form state for next iteration
      await page.goto(`${BASE_URL}/dagpenger/historikk`, { waitUntil: "networkidle" });

      const dateInputAgain = page.getByLabel("Velg dato");
      await dateInputAgain.click();
      await dateInputAgain.fill(date);
      await dateInputAgain.press("Tab");
      await timeSelect.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    }
  }

  await browser.close();
  console.log("\nDone.");
})();
