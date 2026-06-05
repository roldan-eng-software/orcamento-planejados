export const furnitureTypes = [
  { value: "COZINHA_PLANEJADA", label: "Cozinha planejada" },
  { value: "GUARDA_ROUPA", label: "Guarda-roupa" },
  { value: "HOME_OFFICE", label: "Home office" },
  { value: "CLOSET", label: "Closet" },
  { value: "ESTANTE_RACK", label: "Estante / Rack" },
  { value: "OUTRO", label: "Outro" },
] as const;

export const finishOptions = [
  { value: "MDF_BRANCO", label: "MDF branco" },
  { value: "MDF_MADEIRA", label: "MDF cor madeira" },
  { value: "MDF_ESCURO", label: "MDF cor escura" },
  { value: "LACA", label: "Laca" },
  { value: "NAO_SEI", label: "Não sei / Quero sugestão" },
] as const;

export const hardwareOptions = [
  { value: "SOFT_CLOSE", label: "Dobradiças/corrediças soft-close" },
  { value: "PUXADORES_INOX", label: "Puxadores em aço inox" },
  { value: "ILUMINACAO_INTERNA", label: "Iluminação interna" },
  { value: "SEM_PREFERENCIA", label: "Não tenho preferência" },
] as const;

export const budgetRanges = [
  "Até R$ 3.000",
  "R$ 3.000 – R$ 8.000",
  "R$ 8.000 – R$ 15.000",
  "Acima de R$ 15.000",
  "Prefiro receber a sugestão",
] as const;

export const statusLabels = {
  NOVO: "Novo",
  EM_ANALISE: "Em análise",
  ORCADO: "Orçado",
  ENCERRADO: "Encerrado",
} as const;
