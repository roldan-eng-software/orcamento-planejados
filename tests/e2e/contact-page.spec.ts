import { expect, test } from "@playwright/test";

test("contact page loads workshop contacts", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.getByRole("heading", { name: /contato/i })).toBeVisible();
  await expect(page.getByText(/contato@orcaflex/i)).toBeVisible();
});
