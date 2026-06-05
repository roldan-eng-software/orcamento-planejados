import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RequestDetail } from "@/components/admin/request-detail";

describe("admin request detail technical 3D contract", () => {
  it("renders technical 3D project and technical visit choices", () => {
    const html = renderToStaticMarkup(
      <RequestDetail
        request={
          {
            id: "request-1",
            protocol: "ORC-20260605-0001",
            customerName: "Maria Silva",
            customerEmail: "maria@example.com",
            customerWhatsapp: "(11) 91234-5678",
            furnitureType: "CLOSET",
            installationRoom: "Quarto",
            approxWidthCm: "250",
            approxHeightCm: "240",
            approxDepthCm: "60",
            desiredFinishes: ["MDF_BRANCO"],
            wantsTechnical3DProject: true,
            wantsTechnicalVisit: true,
            status: "NOVO",
            statusVersion: 1,
            receiptStatus: "SENT",
            receiptFailureReason: null,
            photos: [],
            notes: [],
            personalDataAnonymizedAt: null,
          } as never
        }
      />,
    );

    expect(html).toContain("Projeto 3D técnico");
    expect(html).toContain("Solicitado (R$ 100,00)");
    expect(html).toContain("Visita técnica");
    expect(html).toContain("Solicitada");
  });
});
