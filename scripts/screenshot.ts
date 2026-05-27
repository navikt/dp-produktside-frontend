import { chromium, Page } from "@playwright/test";

// Usage: npx tsx scripts/screenshot.ts [start-date DD.MM.YYYY] [days-back] [base-url]
// Defaults: start=16.09.2024, days=7, base-url=http://localhost:3000
const startDateArg = process.argv[2] ?? "16.09.2024";
const daysBack = parseInt(process.argv[3] ?? "7", 10);
const BASE_URL = process.argv[4] ?? "http://localhost:3000";

function parseDDMMYYYY(d: string): Date {
  const [dd, mm, yyyy] = d.split(".");
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

  const outputFile =
    "historikk-" + shownTimestamp.replace(/:/g, "-").replace(" ", "_").replaceAll(".", "-") + ".pdf";

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

  const startDate = parseDDMMYYYY(startDateArg);
  const dates: string[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() - i);
    dates.push(toDDMMYYYY(d));
  }

  console.log(`Processing ${dates.length} dates: ${dates[0]} → ${dates[dates.length - 1]}`);

  await page.goto(`${BASE_URL}/dagpenger/historikk`, { waitUntil: "networkidle" });

  for (const date of dates) {
    console.log(`\n── Date: ${date}`);

    const dateInput = page.getByLabel("Velg dato");
    await dateInput.click();
    await dateInput.fill(date);
    await dateInput.press("Tab");

    const timeSelect = page.getByLabel("Velg klokkeslett");
    const appeared = await timeSelect.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);

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


(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 794, height: 1123 });

  console.log(`Navigating to ${BASE_URL}/dagpenger/historikk ...`);
  await page.goto(`${BASE_URL}/dagpenger/historikk`, { waitUntil: "networkidle" });

  // Type date into the DatePicker input
  const dateInput = page.getByLabel("Velg dato");
  await dateInput.click();
  await dateInput.fill(normalisedDate);
  await dateInput.press("Tab");

  // Wait for the time Select to appear
  const timeSelect = page.getByLabel("Velg klokkeslett");
  await timeSelect.waitFor({ state: "visible", timeout: 5000 });

  // Get all options — if only one exists it's the default timestamp, otherwise skip the placeholder at index 0
  const options = await timeSelect.locator("option").all();
  const optionValues = await Promise.all(options.map((o) => o.getAttribute("value")));
  const valuesToPick = optionValues.filter((v) => v && v.length > 0);

  if (valuesToPick.length === 0) {
    console.error("No selectable time options found for this date.");
    await browser.close();
    process.exit(1);
  }

  // Pick the first real (non-empty) value
  const selectedTimestamp = valuesToPick[0]!;
  await timeSelect.selectOption(selectedTimestamp);

  // Click submit
  await page.getByRole("button", { name: "Vis innhold" }).click();

  // Wait for spinner to appear first, then disappear
  const loader = page.locator('[title="Laster inn..."]');
  await loader.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  await loader.waitFor({ state: "hidden", timeout: 60000 });

  // Wait for the main content to actually be in the DOM
  await page.locator("main#maincontent").waitFor({ state: "visible", timeout: 30000 });
  await page.waitForLoadState("networkidle");

  const shownTimestampText = await page
    .getByText(/^Viser innhold for:/)
    .first()
    .textContent();
  const shownTimestamp = shownTimestampText?.replace("Viser innhold for:", "").replace(/\s+/g, " ").trim();

  console.log(`Shown timestamp on page: ${shownTimestamp}`);

  if (!shownTimestamp) {
    console.error("Could not find 'Viser innhold for' text on the page.");
    await browser.close();
    process.exit(1);
  }

  const shownTimestampForFile = shownTimestamp.replace(/:/g, "-").replace(" ", "_").replaceAll(".", "-");
  const outputFile = `${shownTimestampForFile}.pdf`;

  // Mark anchor targets and inject plain-text spans outside <a> tags (not clickable in PDF)
  await page.evaluate(() => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = (link as HTMLAnchorElement).getAttribute("href") ?? "";

      // Mark target element
      const target = document.querySelector(href);
      if (target) target.classList.add("is-anchor-target");

      // Insert plain span after the <a>, outside it
      const span = document.createElement("span");
      span.className = "anchor-ref";
      span.textContent = ` #${href.slice(1)} `;
      link.insertAdjacentElement("afterend", span);
    });
  });

  console.log(`Saving PDF → ${outputFile}`);
  await page.pdf({
    path: outputFile,
    format: "A4",
    printBackground: true,
    scale: 0.9,
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
  });

  await browser.close();
  console.log(`Saved: ${outputFile}`);
})();
