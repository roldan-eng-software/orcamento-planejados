import { expect, test } from "@playwright/test";

test("homepage service scope notice appears and closes", async ({ page }) => {
  await page.goto("/");

  const notice = page.getByRole("dialog", { name: /antes de solicitar seu orçamento/i });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText(
    "Atuamos exclusivamente com móveis planejados novos, personalizados e de médio e alto padrão.",
  );
  await expect(notice).toContainText(
    "Não realizamos reformas, consertos, manutenção de móveis antigos, cortes de chapa, peças avulsas de MDF, serviços em madeira maciça, uso de MDF de baixa qualidade ou instalação de móveis adquiridos pela internet.",
  );
  await expect(page.getByRole("button", { name: "Entendo o que não pedir" })).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    )
    .toBe(true);

  await page.getByRole("button", { name: "Entendo o que não pedir" }).click();
  await expect(notice).toBeHidden();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: /solicite seu orçamento/i })).toBeVisible();
});
