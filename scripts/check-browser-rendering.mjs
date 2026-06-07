import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const outputDir = "test-results/browser-compat";
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
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(baseURL, { waitUntil: "networkidle" });
  const noticeButton = page.getByRole("button", { name: "Entendo o que não pedir" });
  if (await noticeButton.isVisible().catch(() => false)) {
    await noticeButton.click();
  }

  await page.getByRole("heading", { name: /solicite seu orçamento/i }).waitFor();
  await page.getByRole("button", { name: /enviar pedido/i }).click();
  await page.getByText("Revise os campos destacados.").waitFor();
  await page.screenshot({ path: `${outputDir}/${name}-public-form.png`, fullPage: true });

  const publicLayout = await page.evaluate(() => {
    const form = document.querySelector("form");
    const controls = Array.from(document.querySelectorAll("input, select, textarea, button"));
    const overflowingElements = Array.from(document.body.querySelectorAll("*"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: element.getAttribute("class"),
          text: element.textContent?.trim().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.right > document.documentElement.clientWidth || item.left < 0)
      .slice(0, 10);
    return {
      url: window.location.href,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      formWidth: form?.getBoundingClientRect().width ?? 0,
      overflowingElements,
      zeroSizedControls: controls
        .filter((control) => control.getAttribute("type") !== "hidden")
        .filter((control) => {
          const rect = control.getBoundingClientRect();
          return rect.width === 0 || rect.height === 0;
        })
        .map((control) => control.getAttribute("name") || control.textContent?.trim() || control.tagName),
    };
  });

  await page.goto(`${baseURL}/admin/requests`, { waitUntil: "networkidle" });
  await page.waitForURL(/\/admin\/login/);
  await page.getByRole("heading", { name: "Acesso admin" }).waitFor();
  await page.screenshot({ path: `${outputDir}/${name}-admin-login.png`, fullPage: true });

  const adminLayout = await page.evaluate(() => ({
    url: window.location.href,
    hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    emailVisible: Boolean(document.querySelector('input[name="email"]')?.getBoundingClientRect().width),
    passwordVisible: Boolean(document.querySelector('input[name="password"]')?.getBoundingClientRect().width),
  }));

  await browser.close();
  return { name, publicLayout, adminLayout, consoleErrors };
}

await mkdir(outputDir, { recursive: true });
const results = [];

for (const browser of browsers) {
  results.push(await inspectBrowser(browser));
}

console.log(JSON.stringify(results, null, 2));
