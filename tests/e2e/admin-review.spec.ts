import { expect, test } from "@playwright/test";

test("admin route redirects unauthenticated users", async ({ page }) => {
  await page.goto("/admin/requests");
  await expect(page).toHaveURL(/\/admin\/login/);
});
