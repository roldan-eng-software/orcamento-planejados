import { expect, test } from "@playwright/test";

test("privacy page loads LGPD content", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { name: /política de privacidade/i })).toBeVisible();
  await expect(page.getByText(/anonimização/i)).toBeVisible();
});
