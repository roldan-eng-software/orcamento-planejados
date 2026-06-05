import { expect, test } from "@playwright/test";

test("public page shows quote form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entendo o que não pedir" }).click();
  await expect(page.getByRole("heading", { name: /solicite seu orçamento/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /enviar pedido/i })).toBeVisible();
});
