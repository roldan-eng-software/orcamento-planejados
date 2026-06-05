import { expect, test } from "@playwright/test";

test("public form keeps customer on same page for validation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /enviar pedido/i }).click();
  await expect(page).toHaveURL("/");
});
