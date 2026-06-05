import { describe, expect, it } from "vitest";
import { serviceScopeNotice } from "@/lib/content/service-scope-notice";

describe("service scope notice content", () => {
  it("contains the required acknowledgement label", () => {
    expect(serviceScopeNotice.acknowledgementLabel).toBe("Entendo o que não pedir");
  });

  it("contains accepted and rejected service scope copy", () => {
    expect(serviceScopeNotice.body.join(" ")).toContain(
      "Atuamos exclusivamente com móveis planejados novos, personalizados e de médio e alto padrão.",
    );
    expect(serviceScopeNotice.body.join(" ")).toContain(
      "Não realizamos reformas, consertos, manutenção de móveis antigos, cortes de chapa, peças avulsas de MDF, serviços em madeira maciça, uso de MDF de baixa qualidade ou instalação de móveis adquiridos pela internet.",
    );
  });
});
