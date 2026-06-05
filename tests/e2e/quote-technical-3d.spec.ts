import { expect, test } from "@playwright/test";

test("technical visit is gated by technical 3D project", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entendo o que não pedir" }).click();

  const technicalVisit = page.getByRole("checkbox", { name: "Solicitar visita técnica" });
  await expect(technicalVisit).toBeDisabled();
  await expect(page.getByText("A visita técnica só é permitida se contratar o projeto 3D técnico.")).toBeVisible();

  await page.getByRole("checkbox", { name: "Projeto 3D técnico" }).check();
  await expect(
    page.getByText(
      "O projeto 3D técnico tem custo de R$ 100,00. Esse valor poderá ser usado como desconto no fechamento do contrato de fabricação do projeto.",
    ),
  ).toBeVisible();
  await expect(technicalVisit).toBeEnabled();

  await technicalVisit.check();
  await expect(technicalVisit).toBeChecked();

  await page.getByRole("checkbox", { name: "Projeto 3D técnico" }).uncheck();
  await expect(technicalVisit).toBeDisabled();
  await expect(technicalVisit).not.toBeChecked();
});
