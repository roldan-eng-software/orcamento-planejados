import { chromium } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const measurementId = process.env.GOOGLE_ANALYTICS_ID ?? "G-T6H05QHR20";
const browsers = [
  { name: "google-chrome", executablePath: "/usr/bin/google-chrome-stable" },
  { name: "brave", executablePath: "/usr/bin/brave-browser" },
];

async function inspectBrowser({ name, executablePath }) {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 1200 } });
  const consoleErrors = [];
  const analyticsRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("request", (request) => {
    const url = request.url();
    if (
      url.includes("googletagmanager.com/gtag/js") ||
      url.includes("google-analytics.com/g/collect") ||
      url.includes("analytics.google.com/g/collect")
    ) {
      analyticsRequests.push({
        method: request.method(),
        url,
      });
    }
  });

  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  const runtimeState = await page.evaluate((id) => {
    const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    const entries = dataLayer.map((entry) => Array.from(entry));
    return {
      hasDataLayer: Array.isArray(window.dataLayer),
      hasGtag: typeof window.gtag === "function",
      dataLayerLength: dataLayer.length,
      configuredMeasurementId: entries.some((entry) => entry[0] === "config" && entry[1] === id),
      queuedPageView: entries.some(
        (entry) => entry[0] === "event" && entry[1] === "page_view" && entry[2]?.send_to === id,
      ),
    };
  }, measurementId);

  await browser.close();

  return {
    name,
    measurementId,
    runtimeState,
    loadedGtagScript: analyticsRequests.some(
      (request) => request.url.includes("googletagmanager.com/gtag/js") && request.url.includes(measurementId),
    ),
    sentCollectHit: analyticsRequests.some(
      (request) => request.url.includes("/g/collect") && request.url.includes(`tid=${measurementId}`),
    ),
    analyticsRequests,
    consoleErrors,
  };
}

const results = [];

for (const browser of browsers) {
  results.push(await inspectBrowser(browser));
}

console.log(JSON.stringify(results, null, 2));
